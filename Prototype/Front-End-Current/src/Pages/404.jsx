import Header from "Components/Header";
import Breadcrumbs from "Components/Breadcrumbs";
import "./Login.css";
import { Link } from "react-router-dom";

/*This page is a redirect when no match is found for the <route></route>*/
export default function NoMatchingPage() {
    return(
        <>
        <div className="flexBoxColumnGrow error-page">
        <h1 className="error-title">Sorry, 404 Error</h1>
        <h3>The page you are looking for cannot be found.</h3>
        <p>Go back or please try our <Link className="home-button"to="/home">home</Link> page instead.</p>
        </div>
        </>
    )
}