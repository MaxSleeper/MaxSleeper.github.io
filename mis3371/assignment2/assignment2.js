/*
    Author: Maxwell Sleeper
    File: assignment2.js
    Date Created: 2/20/26
    Date Last Edited: 3/27/26
    Version: 1.0
    Description: Validation and review display logic for the patient intake form.
*/

// Clear review area
function removeReview() {
    document.getElementById("outputformdata").innerHTML = "";
}

// User ID check
function checkUserID(field){
    field.value = field.value.toLowerCase();
    field.setCustomValidity('');
    var val = field.value;
    var msg = "";
    if(val.length>0 && val.length<5) msg="User ID must be at least 5 characters.";
    else if(/^[0-9]/.test(val)) msg="User ID must start with a letter.";
    else if(/[^a-z0-9_\-]/.test(val)) msg="Letters, numbers, underscores, hyphens only. No spaces.";
    document.getElementById("userid_text").innerHTML = msg;
}

// Password checks
function checkPasswords(){
    var pw1=document.getElementById("pw1").value;
    var pw2=document.getElementById("pw2").value;
    var uid=document.getElementById("userid").value.toLowerCase();
    var fname=document.getElementById("fname").value.toLowerCase();
    var lname=document.getElementById("lname").value.toLowerCase();
    var msg1="", msg2="";
    if(pw1.length>0){
        if(pw1.length<8) msg1="Password must be at least 8 characters.";
        else if(!/[A-Z]/.test(pw1)) msg1="Password needs at least one uppercase letter.";
        else if(!/[a-z]/.test(pw1)) msg1="Password needs at least one lowercase letter.";
        else if(!/[0-9]/.test(pw1)) msg1="Password needs at least one number.";
        else if(!/[!@#%^&*()\-_+=\/><.,`~]/.test(pw1)) msg1="Password needs at least one special character (!@#%^&*...).";
        else if(pw1.indexOf('"')>=0) msg1="Password cannot contain quotation marks.";
        else if(uid.length>=3 && pw1.toLowerCase().indexOf(uid)>=0) msg1="Password cannot contain your User ID.";
        else if(fname.length>=3 && pw1.toLowerCase().indexOf(fname)>=0) msg1="Password cannot contain your first name.";
        else if(lname.length>=3 && pw1.toLowerCase().indexOf(lname)>=0) msg1="Password cannot contain your last name.";
    }
    if(pw2.length>0 && pw1!==pw2) msg2="Passwords do not match.";
    document.getElementById("pw1_text").innerHTML = msg1;
    document.getElementById("pw2_text").innerHTML = msg2;
}

// Show Review
function showReview(){
    checkPasswords();
    checkUserID(document.getElementById("userid"));

    if(document.getElementById("pw1_text").innerHTML!=""){
        document.getElementById("outputformdata").innerHTML="<p class='errmsg'>Please fix password error before reviewing.</p>";
        document.getElementById("outputformdata").scrollIntoView(); return;
    }
    if(document.getElementById("userid_text").innerHTML!=""){
        document.getElementById("outputformdata").innerHTML="<p class='errmsg'>Please fix User ID error before reviewing.</p>";
        document.getElementById("outputformdata").scrollIntoView(); return;
    }
    if(document.getElementById("pw1").value!==document.getElementById("pw2").value){
        document.getElementById("outputformdata").innerHTML="<p class='errmsg'>Passwords do not match.</p>";
        document.getElementById("outputformdata").scrollIntoView(); return;
    }

    var formcontents=document.getElementById("regForm");
    var output="<h2>-- Please Review Your Information --</h2>";
    output+="<table class='reviewTable'><tr><th>Field</th><th>Value</th><th>Status</th></tr>";

    for(var i=0;i<formcontents.length;i++){
        var e=formcontents.elements[i], t=e.type;
        if(t==="checkbox"){
            output+="<tr><td>"+e.name+"</td><td>"+(e.checked?"Yes":"No")+"</td><td>"+(e.checked?"<span class='ok'>&#10003;</span>":"")+"</td></tr>";
        } else if(t==="radio" && e.checked){
            output+="<tr><td>"+e.name+"</td><td>"+e.value+"</td><td><span class='ok'>&#10003;</span></td></tr>";
        } else if(t==="text" || t==="email" || t==="password" || t==="tel" || t==="date" || t==="textarea" || t==="select-one"){
            if(t==="password") continue; // hide passwords
            var val=e.value||"";
            var status="";
            if(e.required && val==="") status="<span class='errmsg'>Required</span>";
            output+="<tr><td>"+e.name+"</td><td>"+val+"</td><td>"+status+"</td></tr>";
        } else if(t==="range"){
            output+="<tr><td>"+e.name+"</td><td>$"+e.value+"</td><td></td></tr>";
        }
    }
    output+="</table>";
    document.getElementById("outputformdata").innerHTML=output;
    document.getElementById("outputformdata").scrollIntoView();
}
