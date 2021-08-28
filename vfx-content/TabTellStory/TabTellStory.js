export function TabTellStory() {
  return (
    <div className="w-full bg-gray-100">
      <h1 className="text-xl px-5 mb-3 py-5 bg-green-200 text-black w-full">
        <span className="text-xl">Let's Tell Stories</span>
      </h1>
      <div className="px-5">
        <div className="py-3 text-lg  cursor-pointer">1. Choose an Avatar</div>
        <div className="py-3 text-lg">2. Write 10 Lines Sentences Max</div>
        <div className="py-3 text-lg">3. Add Action each sentence</div>
        <div className="py-3 text-lg">4. Preview</div>
        {/*  */}
        <div className="py-3">Content Guidelines and Regulations</div>
        <div className="py-2 text-sm text-gray-500">
          1. Political Content are not allowded.
        </div>
        <div className="py-2 text-sm text-gray-500">
          2. Drama or Strife Content are not allowded.
        </div>
      </div>
    </div>
  );
}
