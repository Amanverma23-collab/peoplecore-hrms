import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import supabase from "../lib/supabase";

import {
UserCog,
Shield,
Briefcase,
Mail,
Lock,
Eye,
EyeOff,
ArrowRight
} from "lucide-react";

export default function Login({ onLogin }: { onLogin: () => void }) {

const [role,setRole]=useState("hr");
const [rememberMe,setRememberMe]=useState(false);
const [showPassword,setShowPassword]=useState(false);

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const [error,setError]=useState("");



const roleColors:any={
hr:"from-[#6c63ff] to-[#8d6bff]",
admin:"from-[#2f6bff] to-[#4f7dff]",
employee:"from-[#10a7c8] to-[#29b5d6]"
}

const roleLabels:any={
hr:"Human Resources",
admin:"System Admin",
employee:"Staff Portal"
}
useEffect(()=>{

setEmail("");
setPassword("");
setError("");

},[role])

return(
<div className="min-h-screen bg-[#dfe4ec] flex flex-col items-center py-6">

<div
className="
w-[90px]
h-[90px]
rounded-[28px]
bg-gradient-to-br
from-[#6c63ff]
to-[#b362ff]
shadow-[10px_10px_20px_#b8bec7,-10px_-10px_20px_#ffffff]
flex items-center justify-center">

<Shield className="text-white" size={34}/>
</div>

<h1 className="mt-6 text-[34px] font-bold text-[#7c5cff]">
PeopleCore HRMS
</h1>

<p className="text-[#6d7f96] text-[15px]">
Human Resource Management System
</p>


<div className="
w-[470px]
max-w-[92vw]
mt-7
rounded-[30px]
bg-[#dfe4ec]
shadow-[15px_15px_35px_#c4c8d0,-15px_-15px_35px_#ffffff]
px-8
py-7">

<h2 className="text-[18px] mb-5">
Sign in as
</h2>


<div className="flex justify-between">

{[
{
id:"hr",
title:"HR",
icon:<UserCog size={28}/>
},
{
id:"admin",
title:"Admin",
icon:<Shield size={28}/>
},
{
id:"employee",
title:"Employee",
icon:<Briefcase size={28}/>
}

].map(item=>(

<div
key={item.id}
onClick={()=>setRole(item.id)}
className={`
w-[90px]
h-[90px]
cursor-pointer
rounded-[20px]
flex
flex-col
items-center
justify-center
relative
transition-all

${role===item.id
?`bg-gradient-to-r ${roleColors[item.id]}
text-white`
:`bg-[#dfe4ec]
text-[#73839a]`
}

shadow-[8px_8px_18px_#c2c8d2,-8px_-8px_18px_#ffffff]
`}>

{item.icon}

<p className="mt-2 text-[15px] font-semibold">
{item.title}
</p>

{role===item.id&&(
<div className="
absolute
bottom-[-9px]
w-8
h-2
rounded-full
bg-white"/>
)}

</div>

))}
</div>

<div className="flex items-center gap-4 my-8">

<div className="h-[2px] flex-1 bg-[#bcc5d0]"/>

<span className="text-[#a0adbe] text-[14px]">
{roleLabels[role]}
</span>

<div className="h-[2px] flex-1 bg-[#bcc5d0]"/>

</div>


<label className="font-semibold">
Email
</label>

<div className="
mt-2
h-[55px]
rounded-[18px]
flex
items-center
px-5
bg-[#dfe4ec]
shadow-[inset_6px_6px_10px_#c7ccd5,inset_-6px_-6px_10px_#fff]
">

<Mail size={20} className="text-[#a0adbe]"/>

<input
autoComplete="off"
name="fakeemail"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="ml-4 bg-transparent outline-none flex-1"
placeholder="Enter your email"
/>

</div>


<label className="font-semibold mt-6 block">
Password
</label>

<div className="
mt-2
h-[55px]
rounded-[18px]
flex
items-center
px-5
bg-[#dfe4ec]
shadow-[inset_6px_6px_10px_#c7ccd5,inset_-6px_-6px_10px_#fff]
">

<Lock size={20} className="text-[#a0adbe]"/>

<input
autoComplete="new-password"
name="fakepassword"
type={showPassword?"text":"password"}
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="ml-4 bg-transparent outline-none flex-1"
placeholder="Enter password"
/>

{
showPassword
?
<EyeOff
onClick={()=>setShowPassword(false)}
className="cursor-pointer"/>
:
<Eye
onClick={()=>setShowPassword(true)}
className="cursor-pointer"/>
}

</div>


<div className="flex justify-between items-center mt-5">

<div
onClick={()=>setRememberMe(!rememberMe)}
className="flex items-center gap-3 cursor-pointer">

<div className="
w-8
h-8
rounded-xl
flex
items-center
justify-center
shadow-[inset_4px_4px_8px_#bcc4ce,inset_-4px_-4px_8px_#fff]
">

{
rememberMe&&(
<div className="
w-7
h-7
rounded-[10px]
bg-gradient-to-br
from-[#8b5cf6]
to-[#6c63ff]
text-white
flex
items-center
justify-center
font-bold">

✓

</div>
)
}

</div>

<span className="text-[#8494aa]">
Remember me
</span>

</div>

<button
type="button"
className="text-[#6c63ff] font-semibold">

Forgot password?

</button>

</div>


{
error&&(

<div className="
mt-5
rounded-[18px]
px-6
py-4
bg-[#f4e5e5]
text-red-500">

{error}

</div>

)
}


<button
onClick={async()=>{

setError("");
const fp = await FingerprintJS.load();

const result = await fp.get();

const currentDevice = result.visitorId;


if(email.trim()==="" || password.trim()===""){
setError("Please enter both email and password");
return;
}

const { data, error } =
await supabase.auth.signInWithPassword({
email,
password
});

if(error){
setError("Invalid credentials");
return;
}

const { data: profile } =
await supabase
.from("profiles")
.select("*")
.eq("id",data.user.id)
.single();

const { data: companySettings } =
await supabase
  .from("company_settings")
  .select("device_binding_enabled")
  .eq("company_id", profile.company_id)
  .single();

const DEVICE_BINDING =
  companySettings?.device_binding_enabled || false;

console.log(
  "DEVICE BINDING =",
  DEVICE_BINDING
);
console.log("PROFILE", profile);
console.log("COMPANY ID =", profile.company_id);
console.log("SELECTED ROLE", role);

if(!profile){
setError("Profile not found");
return;
}

// Device binding
if(
DEVICE_BINDING &&
!profile.device_id
){

await supabase
.from("profiles")
.update({
device_id: currentDevice
})
.eq("id", profile.id);

// update local role
localStorage.setItem(
  "role",
  profile.role
);

localStorage.setItem(
  "company_id",
  profile.company_id
);

console.log(
  "AFTER SAVE",
  localStorage.getItem("company_id")
);

onLogin();

return;

}


else if(
DEVICE_BINDING &&
profile.device_id !== currentDevice
){

await supabase.auth.signOut();

setError(
"This device is not verified. Contact HR"
);

return;
}

console.log("PROFILE", profile);
console.log("COMPANY ID", profile.company_id);
// Role validation
if(
!profile.role ||
profile.role.toLowerCase().trim() !== role.toLowerCase().trim()
){

await supabase.auth.signOut();

setError("Invalid credentials");

return;
}

localStorage.setItem(
  "role",
  profile.role
);

localStorage.setItem(
  "company_id",
  profile.company_id || ""
);

const { data: company } = await supabase
  .from("companies")
  .select("company_name")
  .eq("id", profile.company_id)
  .single();

localStorage.setItem(
  "company_name",
  company?.company_name || ""
);

console.log(
  "AFTER SAVE",
  localStorage.getItem("company_id")
);

onLogin();
}}

className={`
mt-6
w-full
h-[58px]
rounded-[18px]
bg-gradient-to-r
${roleColors[role]}
text-white
font-bold
cursor-pointer
active:scale-95
transition-all
duration-150
hover:brightness-110
`}>

Sign in as {role}

<ArrowRight className="inline ml-2"/>

</button>

</div>


<div className="mt-6 text-[#a0adbe]">

Don't have an account?

<span className="text-[#6c63ff] font-bold cursor-pointer">

{" "}Contact HR

</span>

</div>

<p className="mt-5 text-[#98a4b5]">
© 2025 PeopleCore HRMS
</p>

</div>
)
}