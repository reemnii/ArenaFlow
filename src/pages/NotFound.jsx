import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="w-full px-4 sm:px-6 text-inherit">
      {/* Centered container */}
      <div className="mx-auto flex min-h-[58vh] sm:min-h-[62vh] md:min-h-[66vh] max-w-4xl items-center justify-center pt-36 sm:pt-40 md:pt-44">
        {/* Content wrapper */}
        <div className="w-full text-center">
           {/* Main 404 title */}
          <h1 className="font-extrabold leading-tight tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
            404 Not Found
          </h1>
          
          {/* Description text */}
          <p className="mt-4 mx-auto max-w-md sm:max-w-lg text-sm sm:text-base md:text-lg text-inherit/90">
            The page you are looking for does not exist or may have been moved.
          </p>

          {/* Button to return home */}
          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm sm:text-base font-semibold text-white transition hover:bg-brand/90"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}