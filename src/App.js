import { useState, useEffect } from "react";
import { ethers } from "ethers";
import coursetro_abi from "./Coursetro_abi.json";

export default function App() {
  const contractAddr = "0x9FC2CA7881029bb7849F2C1c00a09fC46736d3c5";
  const [ warning, setWarning ] = useState("　");
  const [instructorInfo, setInstructorInfo] = useState({
    name: "",
    age: 0
  });
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const coursetro = new ethers.Contract(
      contractAddr,
      coursetro_abi,
      provider
    );

    coursetro.on("Instructor", (name, age) => {
      setInstructorInfo({name,age});
    });
  },[]);

  const updateInstructor = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    // https://ithelp.ithome.com.tw/articles/10266109?sc=iThomeR
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    if (network.name !== "ropsten") {
      setWarning("MetaMask 請換成 ropsten 網路");
      return false;      
    }
    setWarning("　");
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const coursetro = new ethers.Contract(contractAddr, coursetro_abi, signer);
    await coursetro.setInstructor(data.get("name"),data.get("age"));
    console.log("updateInstructor");
  };

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <div>
        <form className="m-4" onSubmit={updateInstructor}>
          <div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
            <main className="mt-4 p-4">
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Coursetro Instructor
              </h1>
              <div className="">
                <div className="my-3">
                  <p className="p-3" style={{backgroundColor:"#f1f1f1"}}>
                    { (instructorInfo.name !== "") ?
                    `${instructorInfo.name} ( ${instructorInfo.age} years old)` : warning }
                  </p>
                </div>
              </div>
            </main>
            <footer className="px-4">
              Instructor Name
              <input
                type="text"
                name="name"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                defaultValue="Walter"
                placeholder="Instructor Name"
              />
            </footer>
            <footer className="pt-4 px-4">
              Instructor Age
              <input
                type="text"
                name="age"
                className="input input-bordered block w-full focus:ring focus:outline-none"
                defaultValue="48"
                placeholder="Instructor Age"
              />
            </footer>
            <div className="px-4 py-6">
              <button
                type="submit"
                className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
              >
                Update Instructor
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
