import { CustomLink } from "../components/CustomLink";
import { Button } from "@material-tailwind/react";
const Notfoundpage = () => {
    return (
        <section className="bg-white dark:bg-gray-900 ">
  <div className="container min-h-max px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
    <div className="wf-ull lg:w-1/2">
      <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
        404 хато
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
        Сахифа топилмади
      </h1>
      <p className="mt-4 text-gray-500 dark:text-gray-400">
      Кечирасиз, саҳифани тополмадингиз. Мана, баъзилари фойдали ҳаволалар:
      </p>
      <div className="flex items-center mt-6 gap-x-3">
        <CustomLink to="/">
        <Button>Ўйга қайтиш</Button>
        </CustomLink>
      </div>
    </div>
    <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
      <img
        className="w-full max-w-lg lg:mx-auto"
        src="https://merakiui.com/images/components/illustration.svg"
        alt=""
      />
    </div>
  </div>
</section>

    )
}

export {Notfoundpage};
