import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const RecentIncidents = () => {
  const navigate = useNavigate();
  const staticIncidents = [
    {
      _id: '1',
      title: 'immediate action needed dog is bleeding a bit',
      animalInfo: {
        type: 'Dog',
        description: 'Golden Retriever with injured paw, showing signs of limping and discomfort.',
        photo: 'dog1.jpg',
        aiSeverityAssessment: {
          score: 7
        }
      },
      location: {
        address: 'Ipe engineering college'
      },
      status: 'in progress',
      createdAt: '2024-02-17T10:50:00Z'
    },
    {
      _id: '2',
      title: 'Cat needs urgent medical attention',
      animalInfo: {
        type: 'Cat',
        description: 'Siamese cat with respiratory issues, needs immediate medical attention.',
        photo: 'cat1.jpg',
        aiSeverityAssessment: {
          score: 8
        }
      },
      location: {
        address: 'Central Park Area'
      },
      status: 'pending',
      createdAt: '2024-02-17T09:30:00Z'
    },
    {
      _id: '3',
      title: 'Injured bird found near campus',
      animalInfo: {
        type: 'Bird',
        description: 'Injured sparrow with broken wing, found in local park.',
        photo: 'bird1.jpg',
        aiSeverityAssessment: {
          score: 6
        }
      },
      location: {
        address: 'Main Street Garden'
      },
      status: 'resolved',
      createdAt: '2024-02-17T08:45:00Z'
    }
  ];

  const [incidents, setIncidents] = useState(staticIncidents);

  const handleViewDetails = (incidentId) => {
    navigate(`/doc-patients-health/${incidentId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Patients</h2>
      
      <div className="flex flex-col space-y-4">
        {incidents && incidents.map((incident) => (
          <div 
            key={incident._id} 
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100"
            onClick={() => handleViewDetails(incident._id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {incident.title}
                </h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  </svg>
                  <span className="text-sm">{incident.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-sm">
                    {new Date(incident.createdAt).toLocaleString('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Severity: {incident.animalInfo.aiSeverityAssessment.score}/10
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  incident.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {incident.status}
                </span>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                  <svg 
                    className="w-5 h-5 text-gray-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentIncidents;