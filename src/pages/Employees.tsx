

import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Building2, Calendar } from 'lucide-react';
import supabase from '../lib/supabase';
import Modal from '../components/Modal';
import jsPDF from "jspdf";

const deptOptions = ['Engineering', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'Design', 'Product'];
const statusOptions = ['Active', 'On Leave', 'Probation', 'Inactive'];
const statusColor = (s: string) => s === 'Active' ? 'bg-green-100 text-green-600' : s === 'On Leave' ? 'bg-amber-100 text-amber-600' : s === 'Probation' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600';

export default function Employees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
 const [form,setForm]=useState({

employee_code:"",
name:"",
father_name:"",
gender:"",
dob:"",
phone:"",
email:"",
marital_status:"",
blood_group:"",
photo_url:"",

join_date:"",
department:"",
position:"",
reporting_manager:"",
work_location:"",
employment_type:"Permanent",
status:"",

uan_number:"",
pf_applicable:"",
esic_applicable:"",
pt_applicable:"",
lwf_applicable:"",

resignation_date:"",
last_working_day:"",
notice_period:"",
fnf_status:"",
exit_reason:"",

salary:""

});
  const [editing, setEditing] = useState(false);
const [activeTab,setActiveTab]=useState("basic");
  const fetchEmployees = async () => {
    try {
      let query = supabase.from('employees').select('*').order('id', { ascending: true });
      if (filterDept !== 'All') query = query.eq('department', filterDept);
      if (filterStatus !== 'All') query = query.eq('status', filterStatus);
      if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,position.ilike.%${search}%`);
      const { data, error } = await query; if (error) throw error; setEmployees(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchEmployees(); }, [search, filterDept, filterStatus]);

  const downloadPDF=()=>{

const pdf=new jsPDF();

pdf.setFontSize(18);

pdf.text("Employee Details",20,20);

if(form.photo_url){

pdf.addImage(
form.photo_url,
"JPEG",
150,
20,
40,
40
);

}
pdf.setFontSize(12);

pdf.text(`Employee Code: ${form.employee_code}`,20,40);

pdf.text(`Name: ${form.name}`,20,50);

pdf.text(`Father Name: ${form.father_name}`,20,60);

pdf.text(`Gender: ${form.gender}`,20,70);

pdf.text(`DOB: ${form.dob}`,20,80);

pdf.text(`Mobile: ${form.phone}`,20,90);

pdf.text(`Email: ${form.email}`,20,100);

pdf.text(`Marital Status: ${form.marital_status}`,20,110);

pdf.text(`Blood Group: ${form.blood_group}`,20,120);


pdf.text("Company Details",20,140);

pdf.text(`Joining: ${form.join_date}`,20,150);

pdf.text(`Department: ${form.department}`,20,160);

pdf.text(`Designation: ${form.position}`,20,170);

pdf.text(`Manager: ${form.reporting_manager}`,20,180);

pdf.text(`Location: ${form.work_location}`,20,190);

pdf.text(`Employment: ${form.employment_type}`,20,200);

pdf.text(`Employee Status: ${form.status}`,20,210);

pdf.text(`UAN: ${form.uan_number}`,20,220);


pdf.addPage();

pdf.text("Exit Management",20,20);

pdf.text(`Resignation: ${form.resignation_date}`,20,40);

pdf.text(`Last Working Day: ${form.last_working_day}`,20,50);

pdf.text(`Notice: ${form.notice_period}`,20,60);

pdf.text(`FNF: ${form.fnf_status}`,20,70);

pdf.text(`Reason: ${form.exit_reason}`,20,80);

pdf.save(`${form.name}_details.pdf`);

}
  const handleSubmit = async () => {
    const payload = { ...form, salary: parseFloat(form.salary) || 0 };
    if (editing && selected) { await supabase.from('employees').update(payload).eq('id', selected.id).select(); }
    else { await supabase.from('employees').insert(payload).select(); }
  setModalOpen(false);
setEditing(false);
setSelected(null);

setForm({
employee_code:"",
name:"",
father_name:"",
gender:"",
dob:"",
phone:"",
email:"",
marital_status:"",
blood_group:"",
photo_url:"",
join_date:"",
department:"",
position:"",
reporting_manager:"",
work_location:"",
employment_type:"Permanent",
status:"",
uan_number:"",
pf_applicable:"",
esic_applicable:"",
pt_applicable:"",
lwf_applicable:"",
resignation_date:"",
last_working_day:"",
notice_period:"",
fnf_status:"",
exit_reason:"",
salary:""
});

fetchEmployees();
  };
  const handleEdit=(emp:any)=>{

setSelected(emp);

setForm({
...form,
...emp,
salary:emp.salary?.toString() || ""
});

setEditing(true);

setModalOpen(true);

};
  const handleDelete = async (id: number) => { if (!confirm('Delete?')) return; await supabase.from('employees').delete().eq('id', id); fetchEmployees(); };

  if (loading) return <div className="flex items-center justify-center h-full"><div className="animate-spin w-8 h-8 border-2 border-[#6c63ff] border-t-transparent rounded-full" /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div><h1 className="text-xl sm:text-2xl font-bold text-neu-text">Employees</h1><p className="text-neu-muted text-xs sm:text-sm mt-1">Manage your workforce</p></div>
        <button onClick={() => { setForm({
employee_code:"",
name:"",
father_name:"",
gender:"",
dob:"",
phone:"",
email:"",
marital_status:"",
blood_group:"",
photo_url:"",
join_date:"",
department:"",
position:"",
reporting_manager:"",
work_location:"",
employment_type:"Permanent",
status:"",
uan_number:"",
pf_applicable:"",
esic_applicable:"",
pt_applicable:"",
lwf_applicable:"",
resignation_date:"",
last_working_day:"",
notice_period:"",
fnf_status:"",
exit_reason:"",
salary:""
}); setEditing(false); setModalOpen(true); }} className="neu-btn-accent flex items-center justify-center gap-2 px-4 py-2.5 text-sm"><Plus className="w-4 h-4" /> Add Employee</button>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
       <div className="relative flex-1">

<Search
className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neu-subtle z-10"
/>

<input
value={search}
onChange={e => setSearch(e.target.value)}
placeholder="        Search employees..."
className="neu-input w-full pr-4"
/>

</div>
        <div className="flex gap-2"><select value={filterDept} onChange={e => setFilterDept(e.target.value)} className="neu-input flex-1 sm:flex-none px-3 py-2.5"><option value="All">All Depts</option>{deptOptions.map(d => <option key={d} value={d}>{d}</option>)}</select><select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="neu-input flex-1 sm:flex-none px-3 py-2.5"><option value="All">All Status</option>{statusOptions.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block neu-raised overflow-hidden">
        <div className="overflow-x-auto"><table className="w-full"><thead><tr style={{boxShadow: '0 4px 6px #a3b1c6, 0 -2px 4px #ffffff'}}><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Employee</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Department</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Position</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Status</th><th className="text-left px-5 py-3 text-xs font-bold text-neu-muted uppercase">Join Date</th><th className="text-right px-5 py-3 text-xs font-bold text-neu-muted uppercase">Actions</th></tr></thead>
        <tbody>{employees.map(emp => (<tr key={emp.id} className="hover:bg-[#d1d9e6] transition-colors"><td className="px-5 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#b362ff] flex items-center justify-center text-white text-sm font-semibold">{emp.name?.charAt(0)}</div><div><p className="text-sm font-medium text-neu-text">{emp.name}</p><p className="text-xs text-neu-muted">{emp.email}</p></div></div></td><td className="px-5 py-3 text-sm text-neu-text">{emp.department}</td><td className="px-5 py-3 text-sm text-neu-text">{emp.position}</td><td className="px-5 py-3"><span className={`neu-badge ${statusColor(emp.status)}`}>{emp.status}</span></td><td className="px-5 py-3 text-sm text-neu-muted">{emp.join_date || '-'}</td><td className="px-5 py-3"><div className="flex items-center justify-end gap-1"><button onClick={() => { setSelected(emp); setViewModal(true); }} className="neu-btn p-1.5 rounded-lg text-blue-500 hover:text-blue-600"><Eye className="w-4 h-4" /></button><button onClick={() => handleEdit(emp)} className="neu-btn p-1.5 rounded-lg text-amber-500 hover:text-amber-600"><Edit2 className="w-4 h-4" /></button><button onClick={() => handleDelete(emp.id)} className="neu-btn p-1.5 rounded-lg text-red-500 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></div></td></tr>))}{employees.length === 0 && <tr><td colSpan={6} className="px-5 py-10 text-center text-neu-subtle">No employees found</td></tr>}</tbody></table></div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">{employees.map(emp => (
        <div key={emp.id} className="neu-raised p-4">
          <div className="flex items-start justify-between mb-3"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full neu-avatar flex items-center justify-center text-white text-sm font-bold">{emp.name?.charAt(0)}</div><div><p className="text-sm font-medium text-neu-text">{emp.name}</p><p className="text-xs text-neu-muted">{emp.position}</p></div></div><span className={`neu-badge ${statusColor(emp.status)}`}>{emp.status}</span></div>
          <div className="grid grid-cols-2 gap-2 text-xs text-neu-muted mb-3"><span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{emp.department}</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{emp.join_date || '-'}</span></div>
          <div className="flex items-center gap-2 pt-3" style={{boxShadow: '0 -2px 4px #a3b1c6, 0 2px 4px #ffffff'}}>
            <button onClick={() => { setSelected(emp); setViewModal(true); }} className="flex-1 neu-btn py-2 text-xs flex items-center justify-center gap-1"><Eye className="w-3.5 h-3.5" />View</button>
            <button onClick={() => handleEdit(emp)} className="flex-1 neu-btn py-2 text-xs flex items-center justify-center gap-1"><Edit2 className="w-3.5 h-3.5" />Edit</button>
            <button onClick={() => handleDelete(emp.id)} className="flex-1 py-2 text-xs flex items-center justify-center gap-1 rounded-xl font-semibold text-red-500" style={{background:'#e0e5ec', boxShadow:'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}><Trash2 className="w-3.5 h-3.5" />Delete</button>
          </div>
        </div>
      ))}{employees.length === 0 && <p className="text-neu-subtle text-center py-10">No employees found</p>}</div>

    <Modal
open={modalOpen}
onClose={() => {
setModalOpen(false);
setEditing(false);
}}
title={editing ? 'Edit Employee' : 'Add Employee'}
>

<div className="w-full">

<div className="border-b pb-3">

<div className="flex gap-3 mb-5">

<button
onClick={()=>setActiveTab("basic")}
className={`px-4 py-2 rounded-xl ${
activeTab==="basic"
? "neu-btn-accent"
: "neu-btn"
}`}>
Basic Details
</button>

<button
onClick={()=>setActiveTab("company")}
className={`px-4 py-2 rounded-xl ${
activeTab==="company"
? "neu-btn-accent"
: "neu-btn"
}`}>
Company Details
</button>

<button
onClick={()=>setActiveTab("exit")}
className={`px-4 py-2 rounded-xl ${
activeTab==="exit"
? "neu-btn-accent"
: "neu-btn"
}`}>
Exit Management
</button>

</div>

</div>
{activeTab==="basic" && (
<div className="grid w-full grid-cols-2 gap-8">
<div className="w-full">
<label>Employee Code</label>

<input
value={form.employee_code}
onChange={(e)=>
setForm({
...form,
employee_code:e.target.value
})
}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Full Name</label>

<input
value={form.name}
onChange={(e)=>
setForm({
...form,
name:e.target.value
})
}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Father Name</label>

<input
value={form.father_name}
onChange={(e)=>
setForm({
...form,
father_name:e.target.value
})
}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Gender</label>

<select
value={form.gender}
onChange={(e)=>
setForm({
...form,
gender:e.target.value
})
}
className="neu-input w-full">
<option value="">Select Gender</option>
<option>Male</option>
<option>Female</option>
<option>Other</option>

</select>

</div>
<div className="w-full">
<label>Date Of Birth</label>


<input
type="date"
value={form.dob}
onChange={(e)=>
setForm({
...form,
dob:e.target.value
})
}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Blood Group</label>

<select
value={form.blood_group}
onChange={(e)=>
setForm({
...form,
blood_group:e.target.value
})
}
className="neu-input w-full">

<option value="">Select Blood Group</option>
<option value="A+">A+</option>
<option value="A-">A-</option>
<option value="B+">B+</option>
<option value="B-">B-</option>
<option value="O+">O+</option>
<option value="O-">O-</option>
<option value="AB+">AB+</option>
<option value="AB-">AB-</option>



</select>
</div>
<div className="w-full">
<label className="block text-sm font-medium text-neu-text mb-1">
Department
</label>

<select
value={form.department}
onChange={(e)=>
setForm({
...form,
department:e.target.value
})
}
className="neu-input w-full"
>

<option value="">
Select Department
</option>

{deptOptions.map(d=>
<option key={d} value={d}>
{d}
</option>
)}

</select>
</div>


<div className="w-full">
<label className="block text-sm font-medium text-neu-text mb-1">
Status
</label>

<select
value={form.status}
onChange={(e)=>
setForm({
...form,
status:e.target.value
})
}
className="neu-input w-full"
>

<option value="">
Select Status
</option>

{statusOptions.map(s=>
<option key={s} value={s}>
{s}
</option>
)}

</select>
</div>
          <div className="w-full">
<label>Marital Status</label>

<select
value={form.marital_status}
onChange={(e)=>
setForm({
...form,
marital_status:e.target.value
})
}
className="neu-input w-full">

<option value="">Select Marital Status</option>
<option value="Single">Single</option>
<option value="Married">Married</option>
<option value="Divorced">Divorced</option>

</select>
</div>

<div className="w-full">
<label>Mobile Number</label>

<input
type="tel"
value={form.phone}
onChange={(e)=>
setForm({
...form,
phone:e.target.value
})
}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Email ID</label>

<input
type="email"
value={form.email}
onChange={(e)=>
setForm({
...form,
email:e.target.value
})
}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Photo Upload</label>

<input
type="file"
accept="image/*"
onChange={(e)=>{
const file=e.target.files?.[0];

if(file){

const reader=new FileReader();

reader.onloadend=()=>{

setForm({
...form,
photo_url: reader.result as string
});

};

reader.readAsDataURL(file);

}
}}
className="neu-input w-full"
/>
</div>

</div>

)}

{activeTab==="company" && (

<div className="grid w-full grid-cols-2 gap-8">

<div className="w-full">
<label>Date of Joining</label>

<input
type="date"
value={form.join_date}
onChange={(e)=>setForm({
...form,
join_date:e.target.value
})}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Department</label>

<select
value={form.department}
onChange={(e)=>setForm({
...form,
department:e.target.value
})}
className="neu-input w-full">

<option value="">Select Department</option>

{deptOptions.map(d=>(
<option key={d} value={d}>
{d}
</option>
))}

</select>
</div>

<div className="w-full">
<label>Designation</label>

<input
value={form.position}
onChange={(e)=>setForm({
...form,
position:e.target.value
})}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Reporting Manager</label>

<input
value={form.reporting_manager}
onChange={(e)=>setForm({
...form,
reporting_manager:e.target.value
})}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Work Location</label>

<input
value={form.work_location}
onChange={(e)=>setForm({
...form,
work_location:e.target.value
})}
className="neu-input w-full"
/>
</div>

<div className="w-full">
<label>Employment Type</label>

<select
value={form.employment_type}
onChange={(e)=>setForm({
...form,
employment_type:e.target.value
})}
className="neu-input w-full">

<option value="">Select Type</option>
<option value="Permanent">Permanent</option>
<option value="Intern">Intern</option>
<option value="Contract">Contract</option>
<option value="Fixed Term">Fixed Term</option>

</select>
</div>


<div className="w-full">
<label>Employee Status</label>

<select
value={form.status}
onChange={(e)=>setForm({
...form,
status:e.target.value
})}
className="neu-input w-full">

<option value="">Select Status</option>
<option value="Active">Active</option>
<option value="Notice Period">Notice Period</option>
<option value="Exit">Exit</option>

</select>
</div>




<div className="w-full">
<label>UAN Number</label>

<input
value={form.uan_number}
onChange={(e)=>setForm({
...form,
uan_number:e.target.value
})}
className="neu-input w-full"
/>
</div>


<div className="w-full">
<label>PF Applicable</label>

<select
value={form.pf_applicable}
onChange={(e)=>setForm({
...form,
pf_applicable:e.target.value
})}
className="neu-input w-full">

<option value="">
Select
</option>

<option value="true">
Yes
</option>

<option value="false">
No
</option>

</select>
</div>


<div className="w-full">
<label>ESIC Applicable</label>

<select
value={form.esic_applicable}
onChange={(e)=>setForm({
...form,
esic_applicable:e.target.value
})}
className="neu-input w-full">

<option value="">
Select
</option>

<option value="true">
Yes
</option>

<option value="false">
No
</option>

</select>
</div>


<div className="w-full">
<label>PT Applicable</label>

<select
value={form.pt_applicable}
onChange={(e)=>setForm({
...form,
pt_applicable:e.target.value
})}
className="neu-input w-full">

<option value="">
Select
</option>

<option value="true">
Yes
</option>

<option value="false">
No
</option>

</select>
</div>


<div className="w-full">
<label>LWF Applicable</label>

<select
value={form.lwf_applicable}
onChange={(e)=>setForm({
...form,
lwf_applicable:e.target.value
})}
className="neu-input w-full">

<option value="">
Select
</option>

<option value="true">
Yes
</option>

<option value="false">
No
</option>

</select>
</div>



</div>

)}

</div>
{activeTab==="exit" && (

<div className="grid w-full grid-cols-2 gap-8">

<div className="w-full">
<label>Resignation Date</label>

<input
type="date"
value={form.resignation_date}
onChange={(e)=>setForm({
...form,
resignation_date:e.target.value
})}
className="neu-input w-full"
/>
</div>


<div className="w-full">
<label>Last Working Day</label>

<input
type="date"
value={form.last_working_day}
onChange={(e)=>setForm({
...form,
last_working_day:e.target.value
})}
className="neu-input w-full"
/>
</div>


<div className="w-full">
<label>Notice Period</label>

<input
placeholder="30 Days"
value={form.notice_period}
onChange={(e)=>setForm({
...form,
notice_period:e.target.value
})}
className="neu-input w-full"
/>
</div>


<div className="w-full">
<label>FNF Status</label>

<select
value={form.fnf_status}
onChange={(e)=>setForm({
...form,
fnf_status:e.target.value
})}
className="neu-input w-full">

<option value="">
Select Status
</option>

<option value="Pending">
Pending
</option>

<option value="Completed">
Completed
</option>

</select>

</div>


<div className="w-full col-span-2">
<label>Exit Reason</label>

<textarea
value={form.exit_reason}
onChange={(e)=>setForm({
...form,
exit_reason:e.target.value
})}
className="neu-input w-full h-28"
/>

</div>

</div>

)}
<div className="flex justify-between mt-6">

<button
onClick={downloadPDF}
className="neu-btn px-4 py-2">

Download PDF

</button>

</div>
        <div className="flex justify-end gap-3 mt-6"><button onClick={() => setModalOpen(false)} className="neu-btn px-4 py-2 text-sm">Cancel</button><button onClick={handleSubmit} className="neu-btn-accent px-4 py-2 text-sm">{editing ? 'Update' : 'Add Employee'}</button></div>
      </Modal>

      <Modal open={viewModal} onClose={() => setViewModal(false)} title="Employee Details">
        {selected && (<div className="space-y-4"><div className="flex items-center gap-4 pb-4" style={{boxShadow: '0 4px 6px #a3b1c6, 0 -2px 4px #ffffff'}}><div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full neu-avatar flex items-center justify-center text-white text-xl sm:text-2xl font-bold">{selected.name?.charAt(0)}</div><div><h3 className="text-lg sm:text-xl font-bold text-neu-text">{selected.name}</h3><p className="text-sm text-neu-muted">{selected.position} · {selected.department}</p></div></div>
        <div className="grid grid-cols-2 gap-3"><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Email</p><p className="text-sm text-neu-text break-all">{selected.email}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Phone</p><p className="text-sm text-neu-text">{selected.phone || '-'}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Salary</p><p className="text-sm text-neu-text">₹{Number(selected.salary).toLocaleString('en-IN')}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Join Date</p><p className="text-sm text-neu-text">{selected.join_date || '-'}</p></div><div className="neu-inset-sm p-3"><p className="text-xs text-neu-subtle">Status</p><p className="text-sm text-neu-text">{selected.status}</p></div></div></div>)}
      </Modal>
    </div>
  );
}