import {Route, Routes} from "react-router";
// import KenoPage from "../../KenoPage/KenoPage";
import Crash from "../../Crash/Crash";
import PrivateRoute from '../../../../Services/privateRouter';
import ActivityPage from '../../Activity/Activity';
import LoyaltyPage from '../../Loyalty/Loyalty';
import GamePage from '../../GamePage/GamePage';
import VeriffRouter from '../../../../Services/verifRouter';
import Security from '../../MenuPages/Security/Security';
import PersonalInfo from '../../MenuPages/PersonalInfo/PersonalInfo';
import Notifications from '../../MenuPages/Notifications/Notifications';
import Transactions from '../../MenuPages/Transaction/Transaction';
import Rules from '../../FooterPages/Rules/Rules';
import Home from '../../Home/Home';
import Slots from '../../Slots/Slots';
import Login from '../../AuthPages/Login/Login';
import UpdatePassword from '../../AuthPages/UpdatePassword/UpdatePassword';
import NewPassword from '../../AuthPages/NewPassword/NewPassword';
import UpdateUser from '../../AuthPages/UpdateUser/UpdateUser';
import Register from '../../AuthPages/Register/Register';
import Withdrawal from '../../WalletPages/Withdrawal/Withdrawal';
import Menu from '../../MenuPages/Menu/Menu';
import Responsibility from '../../FooterPages/Responsibility/Responsibility';
import NotificationsSettings from '../../MenuPages/NotificationsSettings/NotificationsSettings';
import Upload from '../../Verify/Upload/Upload';
import Pending from '../../Verify/Pending/Pending';
import Rejected from '../../Verify/Rejected/Rejected';
import TermsNconditions from '../../FooterPages/TermsNconditions/TermsNconditions';
import LoginHistory from '../../MenuPages/LoginHistory/LoginHistory';


const Router = () => {
    return (
        <Routes>
            <Route exact path="/" element={<Home pageName={"/HomePage"} />} />
            <Route exact path='/crashGames' element={<VeriffRouter />}>
                <Route path="/crashGames" element={<Crash pageName={"/crashGames"}/>}/>
            </Route>
            <Route exact path='/slots' element={<VeriffRouter />}>
                <Route path="/slots" element={<Slots pageName={"/SlotsPage"} />} />
            </Route>
            <Route path="/login" element={<Login pageName={"/login"} />}/>
            <Route path="/password-reset" element={<UpdatePassword pageName={"/password-reset"} />}/>
            <Route path="/password-reset/new-password" element={<NewPassword pageName={"/password-reset/new-password"} />}/>
            <Route path="/send-user" element={<UpdateUser pageName={"/send-user"} />}/>
            <Route path="/register" element={<Register pageName={"/register"} />}/>
            <Route exact path='/menu' element={<PrivateRoute/>}>
                <Route exact path='/menu' element={<Menu pageName={"/menu"}/>}/>
            </Route>
            <Route exact path='/menu/security' element={<PrivateRoute/>}>
                <Route exact path='/menu/security' element={<Security pageName={"/menu/security"}/>}/>
            </Route>
            <Route exact path='/menu/transaction' element={<PrivateRoute/>}>
                <Route exact path='/menu/transaction' element={<Transactions pageName={"/menu/transaction"}/>}/>
            </Route>
            <Route exact path='/menu/configurations' element={<PrivateRoute/>}>
                <Route exact path='/menu/configurations' element={<NotificationsSettings pageName={"/menu/configurations"}/>}/>
            </Route>
            <Route exact path='/menu/personal-info' element={<PrivateRoute/>}>
                <Route exact path='/menu/personal-info' element={<PersonalInfo pageName={"/menu/personal-info"}/>}/>
            </Route>
            <Route exact path='/menu/notifications' element={<PrivateRoute/>}>
                <Route exact path='/menu/notifications' element={<Notifications pageName={"/menu/notifications"}/>}/>
            </Route>
            <Route exact path='/menu/notifications/settings' element={<PrivateRoute/>}>
                <Route exact path='/menu/notifications/settings' element={<NotificationsSettings pageName={"/menu/notifications"}/>}/>
            </Route>
            <Route exact path='/menu/loginHistory' element={<PrivateRoute/>}>
                <Route exact path='/menu/loginHistory' element={<LoginHistory pageName={"/menu/loginHistory"}/>}/>
            </Route>
            <Route exact path='/withdrawal' element={<PrivateRoute/>}>
                <Route path="/withdrawal" element={<Withdrawal pageName={"/withdrawal"}/>}/>
            </Route>
            <Route exact path='/activity' element={<PrivateRoute/>}>
                <Route path="/activity" element={<ActivityPage pageName={"/activity"} />} />
            </Route>
            <Route exact path='/loyalty'>
                <Route path="/loyalty" element={<LoyaltyPage pageName={"/loyalty"} />} />
            </Route>
            <Route exact path='/game' element={<VeriffRouter />}>
                <Route path="/game" element={<GamePage pageName={"/game"} />} />
            </Route>
            <Route exact path='/footer/rules' element={<VeriffRouter/>}>
                <Route path="/footer/rules" element={<Rules pageName={"/footer/rules"} />} />
            </Route>
            <Route exact path='/footer/responsibility' element={<VeriffRouter/>}>
                <Route path="/footer/responsibility" element={<Responsibility pageName={"/footer/responsibility"} />} />
            </Route>
            <Route exact path='/footer/termsAndConditions' element={<VeriffRouter/>}>
                <Route path="/footer/termsAndConditions" element={<TermsNconditions pageName={"/footer/termsAndConditions"} />} />
            </Route>
            <Route path="*" exact={true} element={<h1 style={{marginTop: "64px", textAlign:"center"}}>Under Construction</h1>}/>
        </Routes>
    );
};

export default Router;
