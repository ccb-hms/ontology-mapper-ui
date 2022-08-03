import { useState } from "react";
import "./Form.css";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getUrlBase() {
	console.log("PROCESS ENV IS: ", process.env);
	var url_base = "http://";
	url_base += "localhost";
	if (process.env.REACT_APP_DOCKER === "true") {
       	url_base += "8601";
    } else {
    	url_base += "8602";
    }

    return url_base;
}

export default getUrlBase;