import todoListImg from "../../assets/Landing page assets/to-do-list.svg";
import calenderImg from "../../assets/Landing page assets/calender.svg";
import mobileListImg from "../../assets/Landing page assets/mobileNoteList.svg";
import addTaskImg from "../../assets/Landing page assets/add-task.svg";
import myDayImg from "../../assets/Landing page assets/myDayImg.svg";
import responsiveImg from "../../assets/Landing page assets/responsiveImg.svg";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <div className="bg-[#6063B1] h-screen w-full pb-10">
        <section className=" body-font font-popins bg-[#6063B1]">
          <div className="container mx-auto flex px-5 py-12 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col mx-auto md:items-start  mb-16 md:mb-0 items-center text-center">
              <p className="text-3xl mb-2 font-semibold lg:text-4xl text-[#B8A2F7] mx-auto">
                Get Yourself Together
              </p>

              <p className=" text-3xl  mb-4 font-semibold lg:text-4xl text-[#B8A2F7] mx-auto">
                {" "}
                with
              </p>
              <p className="font-bold mb-8 text-5xl md:6xl lg:text-7xl xlg:text-8xl text-[#EDECEC] mx-auto">
                Taskmaster
              </p>
              <div className="flex justify-center mx-auto">
                <Link to="/signup">
                  <button className="flex text-white bg-[#4c3986] border-0 py-2 px-6 focus:outline-none hover:bg-[#523f8b] rounded md:text-base lg:text-lg">
                    <span>Get Started</span>
                    <svg
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-7 ml-1"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </Link>
                <Link to="/login">
                  <button className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded md:text-base lg:text-lg">
                    Login
                  </button>
                </Link>
              </div>
            </div>
            <div className="lg:max-w-lg lg:w-full lg:mx-auto md:w-1/2 w-5/6">
              <img
                className="object-cover object-center rounded"
                alt="hero"
                src={todoListImg}
              />
            </div>
          </div>
        </section>

        <section className="font-popins w-full my-14 bg-[#6063B1]">
          <div className="w-5/6 pb-5 xl:w-5/6 2xl:w-3/6 mx-auto flex flex-col lg:flex-row lg:space-x-7 rounded-xl bg-[#4F5295] lg:bg-[#6063B1]">
            <div className=" w-5/6 md:bg-[#4F5295] rounded-xl py-5 px-3 md:px-10 text-center lg:text-left mx-auto  lg:py-20  flex flex-col sm:space-y-4 ">
              <h1 className="text-3xl text-[#B095D2] lg:text-5xl xl:text-6xl">
                Task Lists
              </h1>
              <p className="text-gray-200 tracking-tighter mt-3 lg:text-xl xl:text-2xl">
                Create multiple task lists, which can be customized and
                organized to suit your needs. Create separate lists for work,
                personal things, shopping, and more. <br /> Or add your tasks in
                the default provided Tasks List.
              </p>
            </div>
            <div className="w-5/6 md:w-1/2 md:bg-[#4F5295] mx-auto rounded-xl lg:py-20 flex items-center">
              <img
                src={mobileListImg}
                alt=""
                srcSet=""
                className="object-cover object-center rounded mx-auto"
              />
            </div>
          </div>
        </section>

        <section className="font-popins w-full my-14 bg-[#6063B1]">
          <div className=" pb-5 w-5/6 xl:w-5/6 2xl:w-3/6 mx-auto flex flex-col-reverse lg:flex-row lg:space-x-7 rounded-xl bg-[#4F5295] px-3 md:px-10">
            <div className="w-5/6 md:w-1/2 md:bg-[#4F5295] mx-auto rounded-xl lg:py-20 flex items-center">
              <img
                src={addTaskImg}
                alt=""
                srcSet=""
                className="object-cover object-center rounded mx-auto"
              />
            </div>
            <div className=" w-5/6 md:bg-[#4F5295] rounded-xl py-5 lg:px-10 text-center lg:text-left mx-auto  lg:py-20  flex flex-col sm:space-y-4 ">
              <h1 className="text-3xl text-[#B095D2] lg:text-5xl xl:text-6xl">
                Create Advanced Tasks
              </h1>
              <div className="text-gray-200 tracking-tighter mt-3 lg:text-xl xl:text-2xl">
                <p className="mb-3 font-semibold">
                  Streamline your task management with intuitive Tasks features.
                </p>
                <ul className="list-disc space-y-2">
                  <li>
                    Easily add tasks to your lists, break them down into steps,
                    and check them off as you go.{" "}
                  </li>
                  <li>Promote a step to a new task if needed.</li>
                  <li>
                    Prioritize your day by adding tasks to 'My Day,' set due
                    dates, and mark tasks as important.
                  </li>
                  <li>
                    Add helpful notes to your tasks for clarity and efficiency.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="font-popins w-full my-14 bg-[#6063B1]">
          <div className="w-5/6 pb-5 xl:w-5/6 2xl:w-3/6 mx-auto flex flex-col lg:flex-row lg:space-x-7 rounded-xl bg-[#4F5295] lg:bg-[#6063B1]">
            <div className=" w-5/6 md:bg-[#4F5295] rounded-xl py-5 px-3 lg:px-10 text-center lg:text-left mx-auto  lg:py-20  flex flex-col sm:space-y-4 ">
              <h1 className="text-3xl text-[#B095D2] lg:text-5xl xl:text-6xl">
                Specialized Lists
              </h1>
              <div className="text-gray-200 tracking-tighter mt-3 lg:text-xl xl:text-2xl">
                <p className="mb-3 font-semibold">
                  Experience efficiency like never before with our specialized
                  lists.
                </p>

                <ul className="list-disc space-y-2">
                  <li>
                    <span className="font-semibold">'My Day'</span> empowers you
                    to focus on the tasks that matter today. Easily view and add
                    tasks to your daily agenda.
                  </li>
                  <li>
                    <span className="font-semibold">'Important'</span> keeps
                    your key priorities in one place, effortlessly displaying
                    all important tasks while automatically categorizing new
                    entries.
                  </li>
                  <li>
                    Meanwhile, <span className="font-semibold">'Planned'</span>{" "}
                    ensures you never miss a deadline by conveniently showing
                    all tasks with due dates.
                  </li>
                </ul>
                <p className="mt-2">
                  Stay organized and in control with these dedicated lists
                  designed to enhance your productivity.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 md:bg-[#4F5295] mx-auto rounded-xl lg:py-20 flex items-center">
              <img
                src={calenderImg}
                alt=""
                srcSet=""
                className="object-cover object-center rounded mx-auto"
              />
            </div>
          </div>
        </section>

        <section className="font-popins w-full my-14 bg-[#6063B1]">
          <div className=" pb-5 w-5/6 xl:w-5/6 2xl:w-3/6 mx-auto flex flex-col-reverse lg:flex-row lg:space-x-7 rounded-xl bg-[#4F5295] px-3 md:px-10">
            <div className=" md:w-1/2 md:bg-[#4F5295] mx-auto rounded-xl lg:py-20 flex items-center">
              <img
                src={myDayImg}
                alt=""
                srcSet=""
                className="object-cover object-center rounded mx-auto"
              />
            </div>
            <div className=" w-5/6 md:bg-[#4F5295] rounded-xl py-5 lg:px-10 text-center lg:text-left mx-auto  lg:py-20  flex flex-col sm:space-y-4 ">
              <h1 className="text-3xl text-[#B095D2] lg:text-5xl xl:text-6xl">
                Effortless Daily Task Planning
              </h1>
              <div className="text-gray-200 tracking-tighter mt-3 lg:text-xl xl:text-2xl">
                <p className="font-semibold mb-3">
                  Seamless task management with the 'My Day' feature.
                </p>
                <p className="mb-3">
                  As your day begins, all tasks with a due date set for today
                  automatically appear, ensuring you never miss an important
                  deadline.{" "}
                </p>
                <p>
                  At day's end, rest easy as completed tasks gracefully vanish,
                  leaving you with a fresh slate for tomorrow. It's the perfect
                  tool to kickstart your day and wrap it up with a sense of
                  accomplishment.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="font-popins w-full my-14 bg-[#6063B1]">
          <div className="w-5/6 pb-5 xl:w-5/6 2xl:w-3/6 mx-auto flex flex-col lg:flex-row lg:space-x-7 rounded-xl bg-[#4F5295] lg:bg-[#6063B1]">
            <div className=" w-5/6 md:bg-[#4F5295] rounded-xl py-5 px-3 lg:px-10 text-center lg:text-left mx-auto  lg:py-20  flex flex-col sm:space-y-4 ">
              <h1 className="text-3xl text-[#B095D2] lg:text-5xl xl:text-6xl">
                Seamless <br />
                Cross-Device Accessibility
              </h1>
              <div className="text-gray-200 tracking-tighter mt-3 lg:text-xl xl:text-2xl">
                <p>
                  Enjoy a consistent user experience on any device or screen
                  size with our fully responsive app. Whether you're on a
                  desktop, tablet, or smartphone, your task management remains
                  smooth and intuitive. Stay organized and productive, no matter
                  where you are.
                </p>
              </div>
            </div>
            <div className="w-full md:w-1/2 md:bg-[#4F5295] mx-auto rounded-xl lg:py-20 flex items-center">
              <img
                src={responsiveImg}
                alt=""
                srcSet=""
                className="object-cover object-center rounded "
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
