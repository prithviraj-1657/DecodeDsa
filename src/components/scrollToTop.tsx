import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

interface ScrollToTopProps {
  lenis: Lenis; // pass the Lenis instance
}

const ScrollToTop = ({ lenis }: ScrollToTopProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 0 }); // scroll instantly to top
    }
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
