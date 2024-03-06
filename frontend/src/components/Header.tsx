type hearderType ={
  username: string
}

function Header({username}:hearderType) {
    return (
        <header className="bg-gray-100 flex justify-between py-4 px-4 items-center">
        <h1 className="text-3xl font-bold text-blue-500">myPaytm</h1>
        <div className="flex gap-5 items-center">
          <h2 className="text-lg font-semibold">Hello! {username}</h2>
          <div className="bg-gray-300 p-3 rounded-md text-center" onClick={()=>{
            localStorage.removeItem("token")
          }}>
            Logout
          </div>
        </div>
      </header>
    )
}

export default Header
