import { useDispatch as useReduxDispatch } from "react-redux";
import { AppDispatch } from "store";

const useDispatch = () => useReduxDispatch<AppDispatch>();

export default useDispatch;
