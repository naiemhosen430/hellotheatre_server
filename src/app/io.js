import activeStatus from "../modules/user/socketIo.user.js";

const useIo = (io) => {
  activeStatus(io);
};

export default useIo;
