import { ReactNode } from "react";

interface HeaderProps {
	links: ReactNode[];
	rightContent: ReactNode;
}

export default function Header({ links, rightContent }: HeaderProps) {
	return (
		<header className="w-full fixed top-0 bg-gray-900 text-white shadow-md">
			<div className="container mx-auto flex justify-between items-center py-4">
				<div className="text-xl font-leckerli">🚀sparkplug</div>
				<nav>
					<ul className="flex space-x-4">
						{links.map((link, index) => (
							<li key={index}>{link}</li>
						))}
					</ul>
				</nav>
				<div>{rightContent}</div>
			</div>
		</header>
	);
}
