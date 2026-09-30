'use client';
import { encrypt, getRandomIv, getRandomSalt } from "@/lib/crypto";
import { useState } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [target, setTarget] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const test = await encrypt(target, password, getRandomSalt(), getRandomIv())
    
    console.log(test)
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}