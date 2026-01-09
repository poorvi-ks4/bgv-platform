import React, { useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Chat from '../../components/chat/ChatBox';
import {uploadDocument, savePersonalDetails } from "../../api/candidate.api";
import  { useEffect } from 'react';
import '../../auth/firebase'; // Go up 2 levels

const CandidateDashboard = ({ user }) => {
  const auth = getAuth();

const [authReady, setAuthReady] = useState(false);

useEffect(() => {
  const auth = getAuth();
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user) setAuthReady(true);
  });
  return unsub;
}, []);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+91 9876543210',
    address: '123 Street, City'
  });
  const [documents, setDocuments] = useState({
    aadhaar: { file: null, status: 'pending' },
    pan: { file: null, status: 'pending' },
    education: { file: null, status: 'verified' },
    experience: { file: null, status: 'rejected' },
    addressProof: { file: null, status: 'pending' }
  });

  const steps = [
    { id: 1, name: 'Personal Details', icon: '👤' },
    { id: 2, name: 'Upload Documents', icon: '📄' },
    { id: 3, name: 'Verification Status', icon: '✓' },
    { id: 4, name: 'Chat with HR', icon: '💬' }
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

const handleFileUpload = async (e, docType) => {
  console.log("🚀 handleFileUpload called with docType:", docType);

  const file = e.target.files[0];
  if (!file) return;

  console.log("📄 File selected:", file.name, file.size);

  const token = await auth.currentUser.getIdToken();
  console.log("🔐 Token obtained:", !!token);

  const formData = new FormData();
  formData.append("document", file);
  formData.append("docType", docType);
  formData.append("userId", auth.currentUser.uid);

  try {
    const res = await uploadDocument({ token, formData });

    console.log("📨 Response status:", res.status);

    if (res.status !== 200 && res.status !== 201) {
  throw new Error(`Upload failed: ${res.status}`);
}

    //const data = await res.json();
    console.log("✅ Upload success:", data);

    alert("Document uploaded successfully");
  } catch (err) {
    console.error("❌ Upload error:", err);
    alert("Upload failed");
  }
};


  const handleNext = () => {
    if (currentStep === 2) {
      // Validate all documents are uploaded
      const allUploaded = Object.values(documents).every(doc => doc.file !== null);
      if (!allUploaded) {
        alert('❌ Please upload all required documents before proceeding');
        return;
      }
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

const handleSaveDetails = async () => {
  if (!auth.currentUser) {
    alert("Please wait, authentication still loading");
    return;
  }

  try {
    await savePersonalDetails({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    });

    alert("Personal details saved");
    handleNext();
  } catch (err) {
    console.error("❌ Save error:", err);
    alert("Failed to save details");
  }
};
 
  return (
    <div>
      <h2>Candidate Portal</h2>

      {/* Progress Steps */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '30px',
        padding: '20px',
        background: '#f5f5f5',
        borderRadius: '8px'
      }}>
        {steps.map((step, index) => (
          <div key={step.id} style={{ 
            flex: 1, 
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: currentStep >= step.id ? '#4CAF50' : '#ddd',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={() => setCurrentStep(step.id)}>
              {currentStep > step.id ? '✓' : step.icon}
            </div>
            <div style={{
              marginTop: '10px',
              fontSize: '12px',
              fontWeight: currentStep === step.id ? 'bold' : 'normal'
            }}>
              {step.name}
            </div>
            {index < steps.length - 1 && (
              <div style={{
                position: 'absolute',
                top: '25px',
                left: '60%',
                width: '80%',
                height: '2px',
                background: currentStep > step.id ? '#4CAF50' : '#ddd',
                zIndex: -1
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ minHeight: '400px' }}>
        {/* Step 1: Personal Details */}
        {currentStep === 1 && (
          <div>
            <h3>Step 1: Personal Details</h3>
            <p>Please fill in your personal information</p>
            <div style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name *
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email *
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Phone *
                </label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Address *
                </label>
                <textarea 
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  style={{ width: '100%', padding: '8px', fontSize: '14px', minHeight: '80px' }}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Documents */}
        {currentStep === 2 && (
          <div>
            <h3>Step 2: Upload Documents</h3>
            <p>Please upload all required documents</p>
            <div style={{ maxWidth: '600px' }}>
              {Object.keys(documents).map(docType => (
                <div key={docType} style={{ 
                  marginBottom: '20px',
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  background: documents[docType].file ? '#f0f8ff' : 'white'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ textTransform: 'capitalize' }}>
                        {docType.replace(/([A-Z])/g, ' $1').trim()} *
                      </strong>
                      {documents[docType].file && (
                        <div style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>
                          ✓ {documents[docType].file.name}
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, docType)}
                      style={{ fontSize: '14px' }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ background: '#fff3cd', padding: '10px', borderRadius: '5px', marginTop: '15px' }}>
                <strong>Note:</strong> Accepted formats: PDF, JPG, PNG (Max 5MB)
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Verification Status */}
        {currentStep === 3 && (
          <div>
            <h3>Step 3: Verification Status</h3>
            <p>Track the status of your document verification</p>
            <div style={{ maxWidth: '700px' }}>
              <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Document</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Uploaded</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(documents).map(docType => (
                    <tr key={docType}>
                      <td style={{ padding: '12px', textTransform: 'capitalize' }}>
                        {docType.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {documents[docType].file ? '✓' : '✗'}
                      </td>
                      <td style={{ 
                        padding: '12px', 
                        textAlign: 'center',
                        color: documents[docType].status === 'verified' ? 'green' : 
                               documents[docType].status === 'rejected' ? 'red' : 'orange',
                        fontWeight: 'bold'
                      }}>
                        {documents[docType].status.toUpperCase()}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        {documents[docType].status === 'rejected' && (
                          <button style={{ fontSize: '12px', padding: '5px 10px' }}>
                            Re-upload
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '5px' }}>
                <strong>Progress:</strong> 2 out of 5 documents verified (40%)
                <div style={{ 
                  width: '100%', 
                  height: '10px', 
                  background: '#ddd', 
                  borderRadius: '5px',
                  marginTop: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: '40%', 
                    height: '100%', 
                    background: '#4CAF50' 
                  }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Chat */}
        {currentStep === 4 && (
          <div>
            <h3>Step 4: Chat with HR</h3>
            <p>Communicate with HR regarding your verification process</p>
            <Chat currentUser={user} />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ 
        marginTop: '30px', 
        paddingTop: '20px', 
        borderTop: '2px solid #ddd',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <button 
          onClick={handlePrevious}
          disabled={currentStep === 1}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 1 ? 0.5 : 1
          }}
        >
          ← Previous
        </button>
        
        {currentStep === 1 && (
          <button 
            onClick={handleSaveDetails}
            disabled={!authReady}
            style={{
              padding: '10px 30px',
              fontSize: '16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
              {authReady ? "Save & Continue" : "Loading auth..."}
        
          </button>
        )}
        
        {currentStep > 1 && currentStep < 4 && (
          <button 
            onClick={handleNext}
            style={{
              padding: '10px 30px',
              fontSize: '16px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: currentStep === 2 && !Object.values(documents).every(d => d.file) ? 'not-allowed' : 'pointer',
              opacity: currentStep === 2 && !Object.values(documents).every(d => d.file) ? 0.5 : 1
            }}
          >
            Next →
          </button>
        )}
        
        {currentStep === 4 && (
          <button 
            style={{
              padding: '10px 30px',
              fontSize: '16px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Complete
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;