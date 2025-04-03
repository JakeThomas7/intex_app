import { useLocation, Link } from 'react-router-dom';

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const RouteBreadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="breadcrumbs">
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <span key={name}>
            <span className="separator"> / </span>
            {isLast ? (
              <span className="current">{capitalizeFirstLetter(name)}</span>
            ) : (
              <Link to={routeTo}>{capitalizeFirstLetter(name)}</Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default RouteBreadcrumbs;