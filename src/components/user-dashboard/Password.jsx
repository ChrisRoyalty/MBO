import React from "react";

const Password = () => {
  return (
    <div className=" w-full text-[#6A7368] flex flex-col gap-10 justify-start">
      <h2 className="text-[16px] text-[#043D12] font-medium border-b-[1px] border-[#6A7368] px-2 py-1 w-fit">
        Change Password
      </h2>
      <form className="w-[70%] flex flex-col gap-8">
        <div className="text-[#6A7368] flex flex-col gap-2">
          <label>Current Password</label>
          <input
            type="password"
            placeholder=""
            className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
          />
        </div>
        <div className="text-[#6A7368] flex flex-col gap-2">
          <label>New Password</label>
          <input
            type="password"
            placeholder=""
            className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
          />
        </div>
        <div className="text-[#6A7368] flex flex-col gap-2">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder=""
            className="w-full h-[46px] px-4 rounded-[11px] border-[1px] border-[#6A7368]"
          />
        </div>
        <div>
          <button
            type="submit"
            className="border-[1px] border-[#6A7368] text-[#6A7368] rounded-[11px] text-[15px] hover:text-white px-2 lg:px-8 py-3  shadow-lg hover:bg-[#043D12]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Password;
