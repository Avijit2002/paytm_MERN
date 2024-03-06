interface accountType{
  balance:number
}

function Account({balance}:accountType) {


  return (
    <div className="h-40 my-10 mx-5 py-5 px-8 bg-gray-100 rounded-md grid grid-rows-2 gap-5">
      <h1 className="text-2xl font-semibold text-center">Account</h1>
      <h2 className="text-xl">Your Balance: {balance}</h2>
    </div>
  );
}

export default Account;
