import { useState } from "react";
import "./Form.css";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getUrlBase() {
	const dev_url = "localhost";
	const prod_url = "app-gena-prod0-rc.hms.harvard.edu";
	console.log(process.env);

	var url_base = "http://";
	if (false) {
		url_base += prod_url;
	} else {
		url_base += dev_url;
	}

	if (process.env.REACT_APP_DOCKER === "true") {
       	url_base += ":8602";
    } else {
    	url_base += ":8601";
    }

    return url_base;
}

export default getUrlBase;