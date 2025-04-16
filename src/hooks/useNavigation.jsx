import { useNavigate } from "react-router-dom";

const useNavigation = () => {
    const navigateTo = useNavigate();

    const navigate = (path, state = {}) => {
        navigateTo(path, { state });
    };

    return { navigate };
};

export default useNavigation;
