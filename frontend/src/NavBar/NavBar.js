import React from "react";
import { NavLink } from "react-router-dom";
import s from "./NavBar.module.css";

function NavigationLink(props) {
    return (
        <div>
            <NavLink className={({ isActive }) => (isActive ? s.active_link : s.link)} to={props.url}>
                <h2>{props.name}</h2>
            </NavLink>
        </div>
    );
}

export default class NavBar extends React.Component {
    render() {
        return (
            <div className={s.navbar}>
                <NavigationLink name="Home" url="/home"></NavigationLink>
                <NavigationLink name="Graphics Playground" url="/graphics_playground"></NavigationLink>
                <NavigationLink name="Graphics Playground 2" url="/graphics_playground_2"></NavigationLink>
                <NavigationLink name="Graphics Playground 3" url="/graphics_playground_3"></NavigationLink>
            </div>
        );
    }
}