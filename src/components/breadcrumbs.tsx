import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";

const Breadcrumbs = ({
  links,
  className,
}: {
  links: { [key: string]: string };
  className?: string;
}) => {
  const linksLen = Object.entries(links).length;
  let currentEl = 0;

  return (
    <div className={className ? className : "absolute top-4 left-2"}>
      <Breadcrumb>
        <BreadcrumbList>
          {Object.entries(links).map(([href, pathName]) => {
            currentEl += 1;

            return (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={href}>{pathName}</BreadcrumbLink>
                </BreadcrumbItem>
                {currentEl !== linksLen && <BreadcrumbSeparator />}
              </>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
