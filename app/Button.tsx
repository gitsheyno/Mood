"use client";

import React from "react";
import { createNewUser } from "./actions/user";

export default function Button() {
  return (
    <button
      onClick={createNewUser}
      className="bg-blue-600 px-4  py-2 rounded-lg text-xl"
    >
      get started
    </button>
  );
}
