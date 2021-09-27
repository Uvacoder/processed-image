import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";
import cx from "classnames";
import FilmRollIcon from '../../public/film-roll.svg';

const SubRoutes =  [
	{ link: "zp", caption: "Запорожье" },
	{ link: "odessa", caption: "Одесса" },
	{ link: "korosten", caption: "Коростень" },
	{ link: "kharkiv", caption: "Харьков" },
	{ link: "chernihiv", caption: "Чернигов" },
	{ link: "kyiv", caption: "Киев" },
].map(({ link, caption }) => ({ link: `/${link}`, caption }));

const Routes = [
  { link: "/animals", caption: "Животные" },
  { link: "/people", caption: "Люди" },
  { link: "/minimalism", caption: "Минимализм" },
  { link: "/plants", caption: "Растения" },
  { link: "/blacknwhite", caption: "Черно-Белое" },
  { link: "/landscape", caption: "Пейзажи" },
  { caption: "Города", subRoutes: SubRoutes }
];

const MobileRoutes = [
	{ link: "/animals", caption: "Животные" },
  { link: "/people", caption: "Люди" },
  { link: "/minimalism", caption: "Минимализм" },
  { link: "/plants", caption: "Растения" },
  { link: "/blacknwhite", caption: "Черно-Белое" },
  { link: "/landscape", caption: "Пейзажи" },
	...SubRoutes
];

function DesktopNav() {
  const { asPath: currentRoute } = useRouter();

	return (
		<ul role="menu" className={styles.DesktopNav}>
			{Routes.map(route => (
				<li key={route.caption} role="menuitem" className={cx(styles.LinkBlock, {
					[styles.Active]: route.link === currentRoute
				})}>
					<Link href={route.link || (route.subRoutes && route.subRoutes.length > 0 ? route.subRoutes[0].link : '/')}>
						<a className={styles.Link} aria-haspopup={!!route.subRoutes}>
							{route.caption}
						</a>
					</Link>
					{route.subRoutes && (
						<menu className={styles.SubMenu}>
							<ul className={styles.SubMenuList}>
								{route.subRoutes.map((subRoute) => (
									<li key={subRoute.link} className={cx(styles.LinkBlock, {
										[styles.Active]: subRoute.link === currentRoute
									})}>
										<Link href={subRoute.link}>
											<a className={styles.SubMenuLink}>{subRoute.caption}</a>
										</Link>
									</li>
								))}
							</ul>
						</menu>
					)}
				</li>
			))}
		</ul>
	);
}

function MobileNav() {
	const [isMobileMenuExpanded, setMobileMenuExpanded] = useState(false);
	const { asPath: currentRoute } = useRouter();

	useEffect(() => {
		if (isMobileMenuExpanded) {
			setTimeout(() => setMobileMenuExpanded(!isMobileMenuExpanded), 2000);
		}
	}, [currentRoute]);

	const handleOpenMenu = () => {
		setMobileMenuExpanded(!isMobileMenuExpanded);
	}

	return (
		<div className={styles.NavMobileBlock}>
			<Link href="/" passHref>
				<span className={styles.NavMobileLogoTitle} role="menuitem">
					<FilmRollIcon className={styles.NavMobileLogo} />
					<h2 className={styles.NavMobileTitle}>Пленочная I & 0</h2>
				</span>
			</Link>
			<div 
				onKeyDown={e => e.key === 'Enter' ? handleOpenMenu() : null }
				tabIndex={0} 
				role="menuitem"
				onClick={handleOpenMenu} 
				className={cx(styles.NavMobile, {
					[styles.NavMobileOpening]: isMobileMenuExpanded,
				})}
			>
				<span></span>
				<span></span>
				<span></span>
			</div>
			{isMobileMenuExpanded && (
				<menu className={styles.NavMobileExpanded} onKeyDown={e => e.key === 'Escape' && setMobileMenuExpanded(false)}>
					{MobileRoutes.map(route => (
						<span key={route.caption} role="menuitem" className={cx({
							[styles.NavMobileActive]: route.link === currentRoute
						})}>
							<Link href={route.link || '/'}>
								<a className={styles.Link}>{route.caption}</a>
							</Link>
						</span>
					))}
				</menu>
			)}
		</div>
	)
}

export default function Navbar() {
  return (
    <nav aria-label="Основная навигация" className={styles.Nav}>
      <MobileNav />
			<DesktopNav />
    </nav>
  );
};
