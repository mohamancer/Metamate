function Post() {
  return (
    <form className="mx-5 mt-4 flex w-fit rounded-lg border-2 border-dashed border-gray-600 p-2 ">
      <div className="flex h-60 w-60 flex-col px-2 ">
        Page
        <select className="mt-2 resize-none rounded-lg border-gray-600 bg-gray-700 p-2 text-sm text-gray-400 shadow-transparent outline-0 focus:border-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
            <option>{item}</option>
          ))}
        </select>
      </div>
      <div className="flex h-60 w-60 flex-col px-2">
        Post
        <textarea className="mt-2 h-60 w-60 resize-none rounded-lg border-gray-600 bg-gray-700 p-2 text-sm text-gray-400 shadow-transparent outline-0 focus:border-none " />
      </div>
      <div className="ml-2 flex h-60 w-60 flex-col px-2">
        Choose Image
        <label
          htmlFor="dropzone-file"
          className="hover:bg-bray-800 mt-2 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-600 bg-gray-700 hover:border-gray-500 hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <svg
              className="mb-4 h-8 w-8 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG</p>
          </div>
          <input id="dropzone-file" type="file" className="hidden" />
        </label>
      </div>
    </form>
  );
}

export default Post;
