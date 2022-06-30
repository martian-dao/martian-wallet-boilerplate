import React from 'react';
import { useAuth } from './context/auth';
import Login from './pages/Login';
import Wallet from './pages/Wallet';

const Routes = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [FinalComponent, setFinalComponent] = React.useState(null)

    React.useEffect(() => {
        /* eslint-disable no-undef */
        chrome.storage.local.get(["OnboardingIsDone"], (resp) => {

            if (resp.OnboardingIsDone) {
                isAuthenticated ? setFinalComponent(<Wallet />) : setFinalComponent(<Login />)
            }
            else {
                setFinalComponent(
                    <div className="page page-login flex flex-col">
                        <div className="page-content flex flex-col justify-center items-center" style={{ flex: 1 }}>
                            <div className="flex flex-col justify-center items-center" style={{ flex: 1, width: '100%' }}>
                                <img src="/images/aptos.svg" alt="aptos" width="72px" height="72px" />
                                <h3 style={{ margin: '15px 0', marginTop: '25px', textAlign: 'center', fontSize: '27px' }}>
                                    Please set up your account on
                                    <span
                                        className="text-green"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => chrome.runtime.sendMessage("open onboarding page")}> Onboarding page
                                    </span>.
                                </h3>
                            </div>

                        </div>
                    </div>
                )
            }
        })
    }, [isAuthenticated])


    return (
        FinalComponent
    );
};

export default Routes;
