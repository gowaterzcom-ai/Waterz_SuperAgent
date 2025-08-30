import React, { useState, FormEvent, useEffect } from 'react';
import styles from '../../styles/Agent/AgentForm.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { ownerAPI } from '../../api/owner';

interface AgentFormData {
  name: string;
  dateOfBirth: string;
  contactNumber: string;
  email: string;
  personalAddress: string;
  username: string;
  experience: string;
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  commission: string;
  imgUrl: string;
}

const AgentForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.state?.isEdit;
  const agentUsername = location.state?.username;

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess,] = useState(false);

  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
    personalAddress: '',
    username: '',
    experience: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    commission: '',
    imgUrl: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AgentFormData, string>>>({});
  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (isEditMode && agentUsername) {
        setIsLoading(true);
        try {
          const agentDetails = await ownerAPI.getAgentDetails(agentUsername);
          setFormData({
            name: agentDetails.name || '',
            dateOfBirth: agentDetails.dateOfBirth || '',
            contactNumber: agentDetails.mobile || '',
            email: agentDetails.email || '',
            personalAddress: agentDetails.address || '',
            username: agentDetails.username || '',
            experience: agentDetails.experience?.toString() || '',
            accountHolderName: agentDetails.accountHolderName || '',
            accountNumber: agentDetails.accountNumber || '',
            bankName: agentDetails.bankName || '',
            ifscCode: agentDetails.ifscCode || '',
            commission: agentDetails.commission?.toString() || '',
            imgUrl: agentDetails.imgUrl || ''
          });
        } catch (error) {
          console.error('Error fetching agent details:', error);
          setSubmitError('Failed to load agent details');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAgentDetails();
  }, [isEditMode, agentUsername]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AgentFormData, string>> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.personalAddress.trim()) newErrors.personalAddress = 'Personal address is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.experience) newErrors.experience = 'Experience is required';
    if (!formData.accountHolderName.trim()) newErrors.accountHolderName = 'Account holder name is required';
    if (!formData.accountNumber.trim()) newErrors.accountNumber = 'Account number is required';
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    if (!formData.ifscCode.trim()) newErrors.ifscCode = 'IFSC code is required';
    if (!formData.commission) newErrors.commission = 'Commission is required';
    if (!formData.imgUrl && !isEditMode) newErrors.imgUrl = 'Profile picture is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Contact number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const file = e.target.files[0];
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType || !isValidSize) {
        setUploadError('Please upload an image file under 5MB.');
        return;
      }

      const imageUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, imgUrl: imageUrl }));
    } catch (error) {
      console.error('Error handling file upload:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Navigate to review page with agent data
      navigate('/agent-review', { 
        state: { 
          agentData: formData,
          isEdit: isEditMode,
          username: agentUsername
        }
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit agent details. Please try again.'
      );
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.yatchBox}>
        <div className={styles.section_head}>Register New Agent</div>
        <div className={styles.section_head2}>Add a new agent to your team</div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.left}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name of the Agent*</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? styles.error : ''}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dateOfBirth">Date of Birth*</label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={errors.dateOfBirth ? styles.error : ''}
            />
            {errors.dateOfBirth && <span className={styles.errorMessage}>{errors.dateOfBirth}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contactNumber">Contact Number*</label>
            <input
              type="tel"
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              className={errors.contactNumber ? styles.error : ''}
            />
            {errors.contactNumber && <span className={styles.errorMessage}>{errors.contactNumber}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address*</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? styles.error : ''}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Username*</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? styles.error : ''}
            />
            {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="experience">Experience (in years)*</label>
            <input
              type="number"
              id="experience"
              value={formData.experience}
              onChange={handleInputChange}
              min="0"
              className={errors.experience ? styles.error : ''}
            />
            {errors.experience && <span className={styles.errorMessage}>{errors.experience}</span>}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.formGroup}>
            <label htmlFor="photo">Profile Picture*</label>
            <div className={styles.fileUpload}>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              {isUploading && <div className={styles.uploadingStatus}>Uploading...</div>}
              {uploadError && <div className={styles.errorMessage}>{uploadError}</div>}
            </div>
            {formData.imgUrl && (
              <div className={styles.imagePreview}>
                <img src={formData.imgUrl} alt="Profile" />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="personalAddress">Personal Address*</label>
            <textarea
              id="personalAddress"
              value={formData.personalAddress}
              onChange={handleInputChange}
              className={errors.personalAddress ? styles.error : ''}
            />
            {errors.personalAddress && <span className={styles.errorMessage}>{errors.personalAddress}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="commission">Commission Percentage*</label>
            <input
              type="number"
              id="commission"
              value={formData.commission}
              onChange={handleInputChange}
              min="0"
              max="100"
              step="0.1"
              className={errors.commission ? styles.error : ''}
            />
            {errors.commission && <span className={styles.errorMessage}>{errors.commission}</span>}
          </div>
        </div>
      </div>

      <div className={styles.bankDetails}>
        <h2>Bank Details</h2>
        <div className={styles.bankGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="accountHolderName">Account Holder Name*</label>
            <input
              type="text"
              id="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleInputChange}
              className={errors.accountHolderName ? styles.error : ''}
            />
            {errors.accountHolderName && <span className={styles.errorMessage}>{errors.accountHolderName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="accountNumber">Account Number*</label>
            <input
              type="text"
              id="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className={errors.accountNumber ? styles.error : ''}
            />
            {errors.accountNumber && <span className={styles.errorMessage}>{errors.accountNumber}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bankName">Bank Name*</label>
            <input
              type="text"
              id="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className={errors.bankName ? styles.error : ''}
            />
            {errors.bankName && <span className={styles.errorMessage}>{errors.bankName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="ifscCode">IFSC Code*</label>
            <input
              type="text"
              id="ifscCode"
              value={formData.ifscCode}
              onChange={handleInputChange}
              className={errors.ifscCode ? styles.error : ''}
            />
            {errors.ifscCode && <span className={styles.errorMessage}>{errors.ifscCode}</span>}
          </div>
        </div>
      </div>

      {submitError && (
        <div className={styles.errorMessage}>
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className={styles.successMessage}>
          Agent details submitted successfully!
        </div>
      )}

      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Save & Proceed'}
      </button>
    </form>
  );
};

export default AgentForm;