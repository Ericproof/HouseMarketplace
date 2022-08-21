import { useEffect, useState, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export function useAuthStatus(){
    const [isLoggedIn, setIsloggedIn] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const isMounted = useRef(true);

    useEffect(()=>{
        if(isMounted){
            const auth = getAuth();
            onAuthStateChanged(auth, (user)=>{
            if(user) {
                setIsloggedIn(true);
            }
            setCheckingStatus(false);

        });
        }
        return ()=>{
            isMounted.current = false;
        }


    },[isMounted]);
    return {isLoggedIn, checkingStatus};

}