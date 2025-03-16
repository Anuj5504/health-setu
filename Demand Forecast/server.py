from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from prophet import Prophet
from datetime import datetime, timedelta
import requests

app = Flask(__name__)
CORS(app)

API_URL = "https://hm-0023-mle-y9wl1.vercel.app/api/prescriptions/getallprescription"

def analyze_demand_trends(data):
    """Analyze demand trends and patterns"""
    trends = {
        'recent_growth': 0,
        'demand_volatility': 'low',
        'alert_level': 'normal'
    }
    
    values = data['y'].values
    non_zero_values = values[values > 0]
    
    if len(non_zero_values) < 2:
        return trends
        
    recent_values = non_zero_values[-3:] if len(non_zero_values) >= 3 else non_zero_values
    older_values = non_zero_values[:-3] if len(non_zero_values) > 3 else non_zero_values
    
    if len(recent_values) > 0 and len(older_values) > 0:
        recent_avg = np.mean(recent_values)
        older_avg = np.mean(older_values)
        if older_avg > 0:
            growth_rate = ((recent_avg - older_avg) / older_avg) * 100
            trends['recent_growth'] = round(growth_rate, 2)
    
    if len(non_zero_values) > 0:
        cv = np.std(non_zero_values) / np.mean(non_zero_values)
        trends['demand_volatility'] = 'high' if cv > 0.5 else 'medium' if cv > 0.25 else 'low'
    
    # Set alert level
    if trends['recent_growth'] > 50 or trends['demand_volatility'] == 'high':
        trends['alert_level'] = 'high'
    elif trends['recent_growth'] > 25 or trends['demand_volatility'] == 'medium':
        trends['alert_level'] = 'medium'
    
    return trends

@app.route('/predict', methods=['GET'])
def predict():
    try:
        response = requests.get(API_URL)
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from API"}), 500

        data = response.json()
        forecasts = {}
        
        for medicine, records in data.items():
            if len(records) < 3:  
                continue
                
            df = pd.DataFrame(records)
            df['ds'] = pd.to_datetime(df['ds'])
            df['y'] = df['yhat']
            df = df.sort_values('ds')
            
            non_zero_demand = df['y'][df['y'] > 0].mean()
            max_demand = df['y'].max()
            
            model = Prophet(
                changepoint_prior_scale=0.05,
                seasonality_prior_scale=0.1,
                seasonality_mode='additive',
                interval_width=0.95,
                daily_seasonality=False,
                weekly_seasonality=False,
                yearly_seasonality=True
            )

            model.fit(df)

            future = model.make_future_dataframe(periods=30, freq='D')
            forecast = model.predict(future)

            demand_trends = analyze_demand_trends(df)
            
            if demand_trends['recent_growth'] != 0:
                adjustment = 1 + (demand_trends['recent_growth'] / 100)
                adjustment = min(max(adjustment, 0.5), 2.0)  
                forecast['yhat'] *= adjustment
            
            min_demand = max(non_zero_demand * 0.3, 1) if non_zero_demand > 0 else 0
            max_demand = max(max_demand * 2, non_zero_demand * 3) if max_demand > 0 else float('inf')
            
            forecast['yhat'] = np.clip(forecast['yhat'], min_demand, max_demand).round()
            forecast['yhat_lower'] = np.maximum(forecast['yhat_lower'].round(), 0)
            forecast['yhat_upper'] = np.minimum(forecast['yhat_upper'].round(), max_demand * 1.5)

            next_month = forecast.iloc[-30:][['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
            
            safety_factors = {
                'low': 1.28,    # 90% service level
                'medium': 1.65, # 95% service level
                'high': 2.33    # 99% service level
            }
            safety_factor = safety_factors[demand_trends['demand_volatility']]
            
            
            total_demand = {
                "medicine_name": medicine,
                "predicted_demand": int(next_month['yhat'].sum()),
                "lower_bound": int(next_month['yhat_lower'].sum()),
                "upper_bound": int(next_month['yhat_upper'].sum()),
                "recommended_stock": int(max(
                    next_month['yhat'].sum() * safety_factor,
                    non_zero_demand * 30 if non_zero_demand > 0 else 0
                )),
                "daily_forecast": [
                    {
                        "ds": row['ds'].strftime('%Y-%m-%d'),
                        "yhat": int(row['yhat'])
                    } for _, row in next_month.iterrows()
                ],
                "demand_analysis": {
                    "growth_rate": f"{demand_trends['recent_growth']}%",
                    "volatility": demand_trends['demand_volatility'],
                    "alert_level": demand_trends['alert_level'],
                    "insights": generate_insights(demand_trends, medicine, non_zero_demand)
                }
            }

            forecasts[medicine] = total_demand

        if not forecasts:
            return jsonify({"error": "No sufficient data for predictions"}), 400

        return jsonify(forecasts)

    except Exception as e:
        print(f"Error in predict: {e}")
        return jsonify({"error": str(e)}), 500

def generate_insights(trends, medicine, avg_demand):
    insights = []
    
    if trends['recent_growth'] > 50:
        insights.append(f"Sharp increase in {medicine} demand (↑{trends['recent_growth']}%). Consider increasing stock immediately.")
    elif trends['recent_growth'] > 25:
        insights.append(f"Moderate increase in {medicine} demand (↑{trends['recent_growth']}%). Monitor closely.")
    elif trends['recent_growth'] < -25:
        insights.append(f"Significant decrease in {medicine} demand (↓{abs(trends['recent_growth'])}%). Consider adjusting stock levels.")
    
    if trends['demand_volatility'] == 'high':
        insights.append(f"High demand variability detected. Maintain higher safety stock.")
    elif trends['demand_volatility'] == 'medium':
        insights.append(f"Moderate demand variability. Monitor stock levels closely.")
    
    if avg_demand > 0:
        insights.append(f"Average monthly demand: {int(avg_demand * 30)} units")
    
    if not insights:
        insights.append("Stable demand patterns. Maintain regular stock levels.")
    
    return insights

if __name__ == '__main__':
    app.run(debug=True, port=5001)