import React, {useState, useEffect} from "react";
import { CustomLink } from './CustomLink';
import {useLocation, useNavigate} from "react-router-dom";
import { getUsername } from "../services/authServices";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {Typography} from "@material-tailwind/react";
import {
    ArrowLeftIcon, ArrowRightIcon,
    BanknotesIcon, CalendarDaysIcon,
    CalendarIcon, ChartPieIcon, ClipboardDocumentCheckIcon,
    IdentificationIcon,
    MinusIcon,
    RectangleStackIcon,
    UserGroupIcon
} from "@heroicons/react/24/solid";
import {CgMenuGridO } from "react-icons/cg";
import {BsCalendar2RangeFill, BsCalendarWeekFill, BsFillCalendar2CheckFill} from "react-icons/bs";

const ExpandedSidebar = ({
                             collapsed,
                             toggled,
                             handleToggleSidebar,
                             handleCollapsedChange
                         }) => {

    const [username, setUsername] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchUsername = async () => {
            const name = await getUsername();
            setUsername(name);
        };

        fetchUsername();
    }, []);

    const formattedUsername = username && username.split(' ').length > 1
        ? username.split(' ').map((word, index) => (
            <React.Fragment key={index}>
                {word}
                {index !== username.split(' ').length - 1 && <br />}
            </React.Fragment>
        ))
        : username;

    return (
        <div className="sticky top-0 z-[7]" style={{display: "flex", height: "100vh"}}>
            <Sidebar breakPoint="md" collapsed={collapsed}
                       toggled={toggled}
                       onToggle={handleToggleSidebar} width="300px" className="app ">

                <Menu>
                   <div className="pt-10 ">
                       <MenuItem icon={<img src="/Group%203.svg" />} className="menu1">


                           <Typography variant="h6" color="black" className="font-bold">
                               {formattedUsername }
                           </Typography>

                       </MenuItem>
                   </div>
                    <CustomLink to="/">
                        <MenuItem className="mt-10" icon={<div className="sidebar-icon-bg p-2 rounded-lg"><BsFillCalendar2CheckFill className="h-5 w-5 sidebar-icon"/></div>  }>
                        Календарь
                    </MenuItem>
                    </CustomLink>
                    {/*<CustomLink to="/roles">*/}
                    {/*<MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg"><IdentificationIcon*/}
                    {/*    className="h-6 w-6 sidebar-icon"/></div>}> Роллар</MenuItem>*/}
                    {/*    </CustomLink>*/}
                    <SubMenu icon={<div className="sidebar-icon-bg p-2 rounded-lg"><UserGroupIcon
                        className="h-6 w-6 sidebar-icon"/></div>} label="Беморлар">
                        <CustomLink to="/patients">  <MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                            <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}> Барча Беморлар </MenuItem>
                            </CustomLink>
                    </SubMenu>
                    {/*<SubMenu icon={<UserGroupIcon className="h-6 w-6"/>} label="Беморлар" style={{ paddingLeft: '20px', borderLeft: '2px solid #000' }}>*/}
                    {/*    <CustomLink to="/patients">*/}
                    {/*        <MenuItem icon={<MinusIcon className="h-6 w-6"/>} style={{ paddingLeft: '40px', borderLeft: '2px solid #000' }}> Барча Беморлар </MenuItem>*/}
                    {/*    </CustomLink>*/}
                    {/*</SubMenu>*/}
                    <SubMenu icon={<div className="sidebar-icon-bg p-2 rounded-lg"><RectangleStackIcon
                        className="h-6 w-6 sidebar-icon"/></div>} label="Каталог">
                        <CustomLink to="/doctors"><MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                            <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}>Докторлар</MenuItem> </CustomLink>
                            <CustomLink to="/services"><MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                                <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}>Хизматлар</MenuItem></CustomLink>
                                <CustomLink to="/partners"><MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                                    <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}>Хамкорлар</MenuItem></CustomLink>
                                    <CustomLink to="/epidemiological_history"><MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                                        <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}>Эпиданамнез
                                    </MenuItem></CustomLink>
                                        <CustomLink to="/international-classification-of-diseases"><MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                                            <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}>МКБ-10
                                        </MenuItem></CustomLink>
                                            </SubMenu>
                    <SubMenu icon={<div className="sidebar-icon-bg p-2 rounded-lg"><BanknotesIcon
                        className="h-6 w-6 sidebar-icon"/></div>} label="Туловлар">
                        <CustomLink to="/payments"> <MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                            <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}> Туловлар тарихи</MenuItem></CustomLink>
                            <CustomLink to="/depts_lists"> <MenuItem icon={<div className="sidebar-icon-bg p-2 rounded-lg">
                                <CgMenuGridO className="h-6 w-6 sidebar-icon"/></div>}> Қарздорлар рўйхати
                            </MenuItem></CustomLink>
                                </SubMenu>
                    <SubMenu icon={<div className="sidebar-icon-bg p-2 rounded-lg"><ClipboardDocumentCheckIcon
                        className="h-6 w-6 sidebar-icon"/></div>} label="Кабуллар">
                        <CustomLink to="/admissions"> <MenuItem
                            icon={<div className="sidebar-icon-bg p-2 rounded-lg"><CgMenuGridO
                                className="h-6 w-6 sidebar-icon"/></div>}>Навбатда</MenuItem></CustomLink>
                                <CustomLink to="/new_admissions"> <MenuItem
                            icon={<div className="sidebar-icon-bg p-2 rounded-lg"><CgMenuGridO
                                className="h-6 w-6 sidebar-icon"/></div>}> Қайта
                                навбатлар</MenuItem></CustomLink>
                        <CustomLink to="/re_admissions"> <MenuItem
                            icon={<div className="sidebar-icon-bg p-2 rounded-lg"><CgMenuGridO
                                className="h-6 w-6 sidebar-icon"/></div>}> Қайта
                                қабуллар</MenuItem></CustomLink>
                        <CustomLink to="/list_of_disponser"> <MenuItem
                            icon={<div className="sidebar-icon-bg p-2 rounded-lg"><CgMenuGridO
                                className="h-6 w-6 sidebar-icon"/></div>}> Диспансер
                                ҳисоби</MenuItem></CustomLink>
                    </SubMenu>
                        <SubMenu icon={<div className="sidebar-icon-bg p-2 rounded-lg"><ChartPieIcon
                            className="h-6 w-6 sidebar-icon"/></div>} label="Ҳисоботлар">
                            <CustomLink to=""> <MenuItem icon={<CgMenuGridO   className="h-6 w-6"/>}>Навбатда</MenuItem></CustomLink>
                        <CustomLink to=""> <MenuItem icon={<CgMenuGridO   className="h-6 w-6"/>}> Қайта навбатлар</MenuItem></CustomLink>
                        <CustomLink to=""> <MenuItem icon={<CgMenuGridO   className="h-6 w-6"/>}> Қайта қабуллар</MenuItem></CustomLink>
                        <CustomLink to=""> <MenuItem icon={<CgMenuGridO   className="h-6 w-6"/>}> Диспонсер ҳисоби</MenuItem></CustomLink>
                    </SubMenu>
                </Menu>
            </Sidebar>
        </div>
    );
};

export default ExpandedSidebar;
