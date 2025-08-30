import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Layouts/YatchCard.module.css';
import { IAgent } from '../../types/agent';

interface AgentCardProps {
  agent: IAgent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/agent/${agent._id}`, { state: { agent } });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{agent.name}</h2>
      </div>
      <div className={styles.imageContainer}>
        <img 
          src={agent.imgUrl[0]} 
          alt={`Agent ${agent.name}`} 
          className={styles.image}
        />
      </div>
      <button className={styles.bookButton} onClick={handleViewProfile}>
        View Profile
      </button>
    </div>
  );
};

export default AgentCard;