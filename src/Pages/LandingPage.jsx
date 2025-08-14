import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Clock, ShieldCheck, Smile } from "lucide-react";
import SmallSpinner from "../components/SmallSpinner";

/* palette */
const COLORS = {
  bgFrom:"#FFF5F5", bgTo:"#FFE8E8",
  grad1 :"#B82E07", grad2:"#FF5B2E",
  danger:"#E63946"
};

/* empty model */
const EMPTY = {
  firstName:"", lastName:"", email:"", phone:"",
  zip:"", insurance:"",
  situation:"", urgency:"",
  symptoms:[], financing:"", notes:"", hipaa:false, tags:""
};

const STEPS = [
  {id:1,title:"Contact & Location",blurb:"Tell us how to reach you."},
  {id:2,title:"Smile Needs",       blurb:"A bit about your goals."}
];

/* helpers */
const cls = (...c) => c.filter(Boolean).join(" ");
const InputWrap = ({label,error,children}) => (
  <div className="mb-6">
    <label className="block text-sm font-semibold text-gray-800">{label}</label>
    <div className="mt-2">{children}</div>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

export default function DentalLeadForm(){
  const [form,setForm] = useState(EMPTY);
  const [step,setStep] = useState(1);
  const [errs,setErrs] = useState({});
  const [sent,setSent] = useState(false);

  /* field handler */
  const handle = e=>{
    const {name,value,type,checked}=e.target;
    if(type==="checkbox" && name==="symptoms"){
      setForm(p=>({...p,
        symptoms:p.symptoms.includes(value)
          ? p.symptoms.filter(v=>v!==value)
          : [...p.symptoms,value]}));
    }else if(type==="checkbox"){
      setForm(p=>({...p,[name]:checked}));
    }else setForm(p=>({...p,[name]:value}));
  };

  /* validation */
  const need={
    1:["firstName","lastName","email","phone","zip","insurance"],
    2:["situation","urgency","financing","hipaa"]
  };
  const validate=()=>{
    const err={};
    need[step].forEach(k=>{
      if(!form[k] || (Array.isArray(form[k])&&!form[k].length)) err[k]="Required";
    });
    setErrs(err);
    return !Object.keys(err).length;
  };

  const next = ()=> validate() ? setStep(2) : toast.error("Fill required fields");
  const prev = ()=> setStep(1);

  /* tags */
  const buildTags=()=>{
    const t=[];
    if(form.symptoms.includes("Pain/Discomfort")||form.urgency==="Today") t.push("urgent");
    if(!form.insurance||form.insurance==="Self-Pay") t.push("verify_insurance");
    return t.join(",");
  };

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const [loading, setLoading] = useState(false);

const submit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true); // Start loading

  const fd = new FormData();
  Object.entries({ ...form, tags: buildTags() })
        .forEach(([k, v]) => fd.append(k, Array.isArray(v) ? v.join(",") : v));
  try {
    const res = await fetch(`${API}/api/lead/`, {
      method: "POST",
      body: fd,
      headers: { Accept: "application/json" },
    });
    res.ok ? (toast.success("Submitted!"), setSent(true)) : toast.error("Submission error");
  } catch {
    toast.error("Network error");
  } finally {
    setLoading(false); // Stop loading
  }
};

  /* style helper */
  const base="w-full px-4 py-3 border rounded-xl focus:ring-2";
  const style=k=>cls(
    base,
    errs[k]
      ? `border-[${COLORS.danger}] focus:ring-[${COLORS.danger}]`
      : `border-gray-300 focus:ring-[${COLORS.grad1}]`
  );

  /* view */
  return (
    <>
      {/* Toast container stays rendered no matter what */}
      <ToastContainer position="top-right" autoClose={4500}/>

      {sent ? (
        /* success screen */
        <section className="min-h-screen flex items-center justify-center"
                 style={{background:`linear-gradient(${COLORS.bgFrom},${COLORS.bgTo})`}}>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
            <h2 className="text-3xl font-bold mb-2" style={{color:COLORS.grad1}}>
              🎉 All set!
            </h2>
            <p>We’ll contact you shortly.</p>
          </div>
        </section>
      ) : (
        /* form screen */
        <section className="min-h-screen flex items-center justify-center py-20 px-4"
                 style={{background:`linear-gradient(${COLORS.bgFrom},${COLORS.bgTo})`}}>
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* hero header */}
            <header className="text-center px-10 pt-10">
              <h1 className="text-4xl font-extrabold mb-3" style={{color:COLORS.grad1}}>
                Free New-Patient Consultation
              </h1>
              <p className="text-gray-600 max-w-lg mx-auto mb-8">
                Complete the form below and our coordinator will confirm your appointment
                within 2&nbsp;hours.
              </p>
            </header>

            {/* step banner */}
            <div style={{background:`linear-gradient(90deg,${COLORS.grad1},${COLORS.grad2})`}}
                 className="px-8 py-5 text-white">
              <h3 className="text-2xl font-bold">{`Step ${step} · ${STEPS[step-1].title}`}</h3>
              <p className="text-white/80 text-sm">{STEPS[step-1].blurb}</p>
            </div>

            {/* form */}
            <form onSubmit={submit} className="p-8 space-y-8">
              {step===1 && (
                <>
                  <div className="grid md:grid-cols-2 gap-6">
                    <InputWrap label="First Name" error={errs.firstName}>
                      <input name="firstName" value={form.firstName}
                             onChange={handle} className={style("firstName")}/>
                    </InputWrap>
                    <InputWrap label="Last Name" error={errs.lastName}>
                      <input name="lastName" value={form.lastName}
                             onChange={handle} className={style("lastName")}/>
                    </InputWrap>
                  </div>
                  <InputWrap label="Email" error={errs.email}>
                    <input type="email" name="email" value={form.email}
                           onChange={handle} className={style("email")}/>
                  </InputWrap>
                  <InputWrap label="Phone" error={errs.phone}>
                    <input name="phone" value={form.phone}
                           onChange={handle} className={style("phone")}/>
                  </InputWrap>
                  <InputWrap label="ZIP / Postal Code" error={errs.zip}>
                    <input name="zip" value={form.zip}
                           onChange={handle} className={style("zip")}/>
                  </InputWrap>
                  <InputWrap label="Insurance Provider" error={errs.insurance}>
                    <select name="insurance" value={form.insurance}
                            onChange={handle} className={style("insurance")}>
                      <option value="">Choose…</option>
                      {["Aetna","Cigna","United Concordia","Self-Pay"].map(o=>
                        <option key={o}>{o}</option>)}
                    </select>
                  </InputWrap>
                </>
              )}

              {step===2 && (
                <>
                  <InputWrap label="Situation" error={errs.situation}>
                    {["One missing tooth","Multiple missing teeth",
                      "Most / all teeth missing","Struggling with dentures"].map(o=>(
                        <label key={o} className="block">
                          <input type="radio" name="situation" value={o}
                                 checked={form.situation===o} onChange={handle}
                                 className="mr-2"/>{o}
                        </label>
                    ))}
                  </InputWrap>

                  <InputWrap label="Urgency" error={errs.urgency}>
                    {["Today","This Week","Flexible"].map(o=>(
                      <label key={o} className="mr-6">
                        <input type="radio" name="urgency" value={o}
                               checked={form.urgency===o} onChange={handle}
                               className="mr-2"/>{o}
                      </label>
                    ))}
                  </InputWrap>

                  {/* C. Reason for Visit  -------------------------------------------------- */}
                  <InputWrap label="Reason for Visit (select all that apply)">
                    {[
                      "Checkup & Cleaning",
                      "Cosmetic Dentistry (e.g., Whitening, Veneers)",
                      "Restorative Dentistry (e.g., Fillings, Crowns)",
                      "Emergency (e.g., Toothache, Broken Tooth)",
                      "Invisalign / Orthodontics",
                      "Other (please specify below)"
                    ].map(opt => (
                      <label key={opt} className="block">
                        <input
                          type="checkbox"
                          name="symptoms"          /* keep the same key for now */
                          value={opt}
                          checked={form.symptoms.includes(opt)}
                          onChange={handle}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}

                    {/* Optional free-text box for “Other” */}
                    {form.symptoms.includes("Other (please specify below)") && (
                      <div className="mt-4">
                        <textarea
                          name="notes"
                          placeholder="Briefly describe your reason"
                          value={form.notes}
                          onChange={handle}
                          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-teal-600"
                        />
                      </div>
                    )}
                  </InputWrap>

                  <InputWrap label="Need financing options?" error={errs.financing}>
                    {["Yes","No"].map(o=>(
                      <label key={o} className="mr-6">
                        <input type="radio" name="financing" value={o}
                               checked={form.financing===o}
                               onChange={handle} className="mr-2"/>{o}
                      </label>
                    ))}
                  </InputWrap>

                  <InputWrap label="Any notes for the team?">
                    <textarea name="notes" value={form.notes}
                              onChange={handle}
                              className={`${style("notes")} min-h-[100px]`}/>
                  </InputWrap>

                  <label className="flex items-start text-sm">
                    <input type="checkbox" name="hipaa" checked={form.hipaa}
                           onChange={handle} className="mr-2 mt-1"/>
                    <span>I consent to receive communications and understand my data is handled securely.</span>
                  </label>
                  {errs.hipaa && <p className="text-xs text-red-600 mt-1">{errs.hipaa}</p>}
                </>
              )}

              {/* buttons */}
              <div className="flex justify-between pt-2">
                {step===2 && (
                  <button type="button" onClick={prev}
                          className="px-6 py-3 rounded-full border text-gray-600">Back</button>
                )}
                {step===1 && (
                  <button type="button" onClick={next}
                          className="px-8 py-3 rounded-full text-white shadow-md hover:scale-105 transition"
                          style={{background:`linear-gradient(90deg,${COLORS.grad1},${COLORS.grad2})`}}>
                    Next
                  </button>
                )}
                {step === 2 && (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 rounded-full text-white shadow-md transition flex items-center justify-center gap-2 
                      ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.grad1}, ${COLORS.grad2})`
                    }}
                  >
                    {loading ? (
                      <>
                        <SmallSpinner />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit</span>
                    )}
                  </button>
                )}

              </div>
            </form>

            {/* footer grid */}
            <div className="px-8 pb-12">
              <div className="mt-12 grid md:grid-cols-3 gap-8">
                {[
                  {icon:Clock,title:"Quick Response",text:"Confirm within 2 hours"},
                  {icon:ShieldCheck,title:"HIPAA-Secure",text:"Your data is protected"},
                  {icon:Smile,title:"Friendly Care",text:"Compassionate assistance"}
                ].map(({icon:Icon,title,text})=>(
                  <div key={title} className="text-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                         style={{background:COLORS.bgTo}}>
                      <Icon className="w-6 h-6" style={{color:COLORS.grad1}}/>
                    </div>
                    <h4 className="font-semibold mb-2" style={{color:COLORS.grad1}}>{title}</h4>
                    <p className="text-gray-600 text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
