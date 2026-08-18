import {useState, useContext} from "react"
import {AuthContext} from "../context/AuthContext"

export default function Login(){
    const {login, loading} = useContext(AuthContext);

    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });

    const handleChange = (event) =>{
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,

        });
    };

    const handleSubmit = async(event)=>{
        event.preventDefault();

        await login(formData);
    };

    return(
    <div>
      <h1>LedgerFlow Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    )
}