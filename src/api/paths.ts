const  URL= 'https://www.backend.wavezgoa.com';
  // const  URL= 'http://localhost:8000'; // local server
const userBaseURL = URL + "/user";
const owner = URL + "/owner";
const signUp = URL + "/auth";
const booking = URL + "/booking";
const superagent = URL + "/superagent";


export const paths = {
  // Auth endpoints
  login: `${signUp}/signin`,
  signup: `${signUp}/signup`,
  generateOtp: `${signUp}/generate-otp`,
  verifyOtp: `${signUp}/verify-otp`,
  logout: `${userBaseURL}/logout`,
  googleAuth: `${userBaseURL}/google`,
  
  // User endpoints
  getUserProfile: `${superagent}/profile`,
  updateUserProfile: `${userBaseURL}/profile/update`,
  
  // yacht
  getYachtList: `${superagent}/listAll`,
  getTopYachts: `${superagent}/topYatch`,

  // query
  userQuery: `${URL}/query`,

  // agent
  agentDetails: `${superagent}/agent-details`,
  // filter
  locationFilter: `${booking}/idealYatchs`,
  bookYacht: `${booking}/create`,

  // owner
  createYacht: `${owner}/create`,
  ownerProfile: `${owner}/me`,
  ownerYachts: `${owner}/me/yatchs`,
  ownerYachtDetail:`${owner}/me/yatch`,
  ownerCurrentRides: `${owner}/current/rides`,
  ownerPreviousRides: `${owner}/prev/rides`,
  ownerPreviousRideDetail: `${owner}/prev/ride`,
  updateYacht: `${owner}/update`,
  deleteYacht: `${owner}/delete`,
  ownerEarnings: `${owner}/me/earnings`,

  // superagent
  referralLink: `${superagent}/create-refferal`,
  getAllAgents:`${superagent}/list-all-agent`,
  getAgent:`${superagent}/get-agent`,
  removeAgent:`${superagent}/remove-agent`,
  getBookings:`${superagent}/list-filtered-agent`,
  updateProfile: `${superagent}/updateProfile`,
  superagentEarnings: `${superagent}/list-filtered-earnings`,
  superagenProfile: `${superagent}/me`,

};

export default paths;
