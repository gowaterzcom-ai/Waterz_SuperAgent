import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/Layouts/YatchCard.module.css';

interface YachtCardProps {
  name: string;
  capacity: number;
  startDate: string;
  images: string;
  bookingId: string; // Unique ID for the yacht
  booking?: any;
}

const BookedCard: React.FC<YachtCardProps> = ({ name, capacity, startDate, images, bookingId, booking }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate(`/booking/${bookingId}`, {state: {booking: booking}});
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.capacity}>Capacity: {capacity} people</p>
      </div>
      <div className={styles.imageContainer}>
        <img src={images} alt={name} className={styles.image} />
        <div className={styles.priceTag}>Date: {formatDate(startDate)}</div>
      </div>
      <button className={styles.bookButton} onClick={handleBookNow}>
        View Details
      </button>
    </div>
  );
};

export default BookedCard;


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from '../../styles/Layouts/YatchCard.module.css';

// interface YachtCardProps {
//     name: string;
//     capacity: number;
//     startingPrice: string;
//     imageUrl: string;
//     yachtId: string;
//     isPrev?: boolean;
//     isEarning?: boolean;
//     yacht?: any; // Full yacht data to pass to details page
// }

// const BookedCard: React.FC<YachtCardProps> = ({
//     name,
//     capacity,
//     startingPrice,
//     imageUrl,
//     yachtId,
//     isPrev,
//     isEarning = false,
//     yacht // New prop for full yacht data
// }) => {
//     const navigate = useNavigate();
//     console.log("yacht", yacht);
//     const handleBookNow = () => {
//         navigate(`/yatch-details/${yachtId}`, { 
//             state: { 
//                 booking: yacht 
//             } 
//         });
//     };

//     return (
//         <div className={styles.card}>
//             <div className={styles.header}>
//                 <h2 className={styles.name}>{name}</h2>
//                 {isEarning ? (
//                     <p className={styles.capacity}>Date: {startingPrice}</p>
//                 ) : (
//                     <p className={styles.capacity}>Capacity: {capacity} guests</p>
//                 )}
//             </div>
//             <div className={styles.imageContainer}>
//                 <img src={imageUrl} alt={name} className={styles.image} />
//                 {!isPrev && !isEarning && (
//                     <div className={styles.priceTag}>Starting at ₹{startingPrice}</div>
//                 )}
//             </div>
//             {isEarning ? (
//                 <button className={styles.bookButton}>
//                     Earning: ₹{capacity}
//                 </button>
//             ) : (
//                 <button className={styles.bookButton} onClick={handleBookNow}>
//                     View Details
//                 </button>
//             )}
//         </div>
//     );
// };

// export default BookedCard;