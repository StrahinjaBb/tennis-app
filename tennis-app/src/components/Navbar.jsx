import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav>
            <div className="">
                <h1>Tenis Krstulovic</h1>
                <div>
                    <Link>Home</Link>
                    <Link>Termini</Link>
                    <Link>Admin</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;