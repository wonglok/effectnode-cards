import { useEffect, useState } from "react";
import {
  MemoryRouter,
  Switch,
  Route,
  NavLink as RRDLink,
} from "react-router-dom";
import Link from "next/link";
import { useRouter } from "next/router";
function AreaAdapt({ children }) {
  let [mobile, setMobile] = useState(false);

  useEffect(() => {
    let tt = 0;
    let h = () => {
      clearTimeout(tt);
      tt = setTimeout(() => {
        setMobile(window.innerWidth <= 500);
      }, 0);
    };
    setMobile(window.innerWidth <= 500);
    window.addEventListener("resize", h);
    return () => {
      window.removeEventListener("resize", h);
    };
  }, []);
  return (
    <div
      className="bg-gray-100"
      style={
        mobile
          ? {
              height: "calc(100% - 4rem)",
            }
          : {
              height: "100%",
            }
      }
    >
      {children}
    </div>
  );
}

export default function StoryMaker() {
  let {
    query: { cardID },
  } = useRouter();

  if (!cardID) {
    return <div></div>;
  }

  return (
    <MemoryRouter>
      <link
        rel="stylesheet"
        href="https://use.fontawesome.com/releases/v5.8.2/css/all.css"
        integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay"
        crossorigin="anonymous"
      />
      <section className="bg-gray-100 font-sans leading-normal tracking-normal h-full">
        <div className="flex md:flex-row-reverse flex-wrap  h-full">
          {/* <!--Main Content--> */}
          <div className="w-full h-full md:w-5/6 bg-gray-100 ">
            <AreaAdapt>
              <Switch>
                <Route exact path="/">
                  <div className="container bg-gray-100 pt-5 px-5">
                    <h1 className="text-xl">
                      <Link
                        class="hover:cursor-pointer"
                        href={`/card-room/${cardID}`}
                      >
                        <span class="underline">Your Room</span>
                      </Link>{" "}
                      / <span className="text-xl">Story Teller</span>
                    </h1>
                  </div>
                  {/* <AdvancedCanvas /> */}
                </Route>
                {/*  */}
                <Route path="/examples/basic">
                  <div>basic</div>
                  {/*  */}
                  {/* <BasicCanvas /> */}
                </Route>

                {/*  */}
                <Route path="/examples/museum">
                  <div>museum</div>
                  {/*  */}
                  {/* <BasicCanvas /> */}
                </Route>

                {/*  */}
                <Route path="/examples/dark">
                  <div>dark</div>
                  {/*  */}
                  {/* <DarkCanvas /> */}
                </Route>

                {/*  */}
                <Route path="/examples/fire">
                  <div>fire</div>
                  {/*  */}
                  {/* <NegativeCanvas /> */}
                </Route>

                <Route>Not Found...</Route>
              </Switch>
            </AreaAdapt>
            {/* <div className='container bg-gray-100 pt-16 px-6'></div> */}
          </div>

          {/* <!--Sidebar--> */}
          <div className="w-full md:w-1/6 bg-gray-900 md:bg-gray-900 px-2 text-center fixed bottom-0 md:pt-8 md:top-0 md:left-0 h-16 md:h-screen md:border-r-4 md:border-gray-600">
            <div className="md:relative mx-auto lg:float-right lg:px-6">
              <ul className="list-reset flex flex-row md:flex-col text-center md:text-left">
                <li className="mr-3 flex-1">
                  <RRDLink
                    activeStyle={{
                      color: "hotpink",
                      borderColor: "hotpink",
                    }}
                    exact={true}
                    to="/"
                    className="block py-1 md:py-3 border-b-2 text-gray-400  pl-1 align-middle no-underline hover:text-pink-500 hover:border-pink-500"
                  >
                    <i className="fas fa-home pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base block md:inline-block lg:pr-10">
                      Home
                    </span>
                  </RRDLink>
                </li>
                <li className="mr-3 flex-1">
                  <RRDLink
                    activeStyle={{
                      color: "hotpink",
                      borderColor: "hotpink",
                    }}
                    exact={true}
                    to="/examples/museum"
                    className="block py-1 md:py-3 border-b-2 text-gray-400  pl-1 align-middle no-underline hover:text-pink-500 hover:border-pink-500"
                  >
                    <i className="fas fa-link pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base block md:inline-block lg:pr-10">
                      Museum
                    </span>
                  </RRDLink>
                </li>
                <li className="mr-3 flex-1">
                  <RRDLink
                    activeStyle={{
                      color: "hotpink",
                      borderColor: "hotpink",
                    }}
                    exact={true}
                    to="/examples/dark"
                    className="block py-1 md:py-3 border-b-2 text-gray-400  pl-1 align-middle no-underline hover:text-pink-500 hover:border-pink-500"
                  >
                    <i className="fas fa-link pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base block md:inline-block lg:pr-10">
                      Dark
                    </span>
                  </RRDLink>
                </li>
                <li className="mr-3 flex-1">
                  <RRDLink
                    activeStyle={{
                      color: "hotpink",
                      borderColor: "hotpink",
                    }}
                    exact={true}
                    to="/examples/fire"
                    className="block py-1 md:py-3 border-b-2 text-gray-400  pl-1 align-middle no-underline hover:text-pink-500 hover:border-pink-500"
                  >
                    <i className="fas fa-link pr-0 md:pr-3"></i>
                    <span className="pb-1 md:pb-0 text-xs md:text-base block md:inline-block lg:pr-10">
                      Fire
                    </span>
                  </RRDLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MemoryRouter>
  );
}
