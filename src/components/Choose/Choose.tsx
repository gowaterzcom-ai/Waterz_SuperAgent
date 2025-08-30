import React, { useEffect, useState } from "react";
import styles from "../../styles/Choose/Choose.module.css";
import AgentCard from "../Layouts/AgentCard";
import { Link } from "react-router-dom";
import { superagentAPI } from "../../api/superagent";
import { useAppDispatch, useAppSelector } from "../../redux/store/hook";
import { setAllAgents, setLoading, setError } from "../../redux/slices/agentSlice";
import { setReferralLink } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const AgentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allAgents, loading, error } = useAppSelector((state) => state.agent);
  const { isAuthenticated } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const {userDetails}  = useAppSelector((state) => state.user)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        dispatch(setLoading(true));
        const response = await superagentAPI.getAllAgents();
        
       
          // Transform the data if needed to match the IAgent interface
          const transformedAgents = response.allAgents.map((agent: any) => ({
            id: agent._id || agent.id,
            username: agent.username,
            name: agent.name,
            age: agent.age,
            experience: agent.experience,
            email: agent.email,
            phone: agent.phone,
            address: agent.address,
            accountHolderName: agent.accountHolderName,
            accountNumber: agent.accountNumber,
            bankName: agent.bankName,
            ifscCode: agent.ifscCode,
            commissionRate: agent.commissionRate,
            imgUrl: agent.imgUrl,
            bookings: agent.bookings || []
          }));
          
          dispatch(setAllAgents(transformedAgents));
        
      } catch (err) {
        console.error('Error fetching agents:', err);
        dispatch(setError(err instanceof Error ? err.message : 'Failed to fetch agents'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAgents();
  }, [dispatch]);

  const handleGetReferralLink = async () => {
    try {
        setIsLoading(true);
        const response = await superagentAPI.getReferralLink();
        if (response.link) {
            dispatch(setReferralLink(response.link));
            navigate('/account');
        }
    } catch (error) {
        console.error('Error getting referral link:', error);
    } finally {
        setIsLoading(false);
    }
};

  if (loading) {
    return (
      <div className={styles.comp_body}>
        <div className={styles.loadingContainer}>
          Loading agents...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.comp_body}>
        <div className={styles.errorContainer}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.comp_body}>
      <div className={styles.yatchBox}>
        <div className={styles.section_head2}>
          Add Agents
        </div>
        <div className={styles.section_head}>
          Create Profile, Set Commissions
        </div>
        {isAuthenticated && userDetails.isVerifiedByAdmin ? (
                  <div className={styles.account_section}>
                      <button 
                          className={styles.hero_btn2}
                          onClick={handleGetReferralLink}
                          disabled={isLoading}
                      >
                          {isLoading ? 'Loading...' : 'Get Referral Link'}
                      </button>
                  </div>
              ) : (
                  <Link to="/signup">
                      <div className={styles.hero_btn}>Start Now</div>
                  </Link>
              )}
      </div>

      <div className={styles.yatchBox}>
        <div className={styles.section_head2}>
          My Agents
        </div>
        <div className={styles.section_head}>
          View, Edit & Set Commissions
        </div>
      </div>

      <div className={styles.yachtGrid}>
        {allAgents && allAgents.length > 0 ? (
          allAgents.map((agent) => (
            <AgentCard
              key={agent._id}
              agent={agent}
            />
          ))
        ) : (
          <div className={styles.noAgentsContainer}>
            No agents found. Add your first agent to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;