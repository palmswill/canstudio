import React from "react"
import Users from "./users/users"
import main from "./main.css"

const Mainsurface=()=>{




    return(
        <div>
            <div className="row  teal lighten-2 " style={{ height: "10vh", "marginBottom":"0" }}>
                <div className="col s12" style={{ height: "100%" }}></div>
            </div>
            <div className="row" style={{ height: "90vh", "marginBottom":"0" }}>
                <div className=" col s2 light-green lighten-5" style={{ height: "100%" }}></div>
                <div className=" col s10" style={{height:"100%"}}><Users></Users></div>
            </div>

        </div>
    )

}

export default Mainsurface