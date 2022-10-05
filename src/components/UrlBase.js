import { useState } from "react";
import "./Form.css";
import { Dropzone, FileItem } from "@dropzone-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function getUrlBase() {
	const dev_url = "http://localhost";
	const prod_url = "https://text2term.hms.harvard.edu";

	var url_base = "";
	if (false) {
		url_base += prod_url;
	} else {
		url_base += dev_url;
		if (process.env.REACT_APP_DOCKER === "true") {
	       	url_base += ":8602";
	    } else {
	    	url_base += ":8601";
    	}
	}

    return url_base;
}

export default getUrlBase;