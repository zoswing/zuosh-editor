import * as React from 'react';
import './index.scss';
import { MenuItemProps, MenuProps } from './types'

class Menu extends React.Component<MenuProps, object>  {
    public state: any = {
        menus: {},
    }

    private contextMenu!: HTMLDivElement;

    private genMenus = (props: MenuProps) => {
        return {
            dataSource: props.data,
            show: true,
            subMenu: this.resolveMenuData(props.data),
        }
    }

    constructor(props: MenuProps) {
        super(props);
        const menus = this.genMenus(props);
        this.state = {
            menus,
        }
    }

    public componentWillReceiveProps(nextProps: MenuProps) {
        this.setState({
            menus: this.genMenus(nextProps)
        });
    }

    public resolveMenuData = (menuData: any[]) => {
        const data: any[] = [];
        menuData.forEach(item => {
            const dataItem = {
                dataSource: item,
                show: false,
                subMenu: (Array.isArray(item.subMenu) && item.subMenu.length > 0)
                    ? this.resolveMenuData(item.subMenu) : [],
            };
            data.push(dataItem);
        });
        return data;
    }

    public componentDidMount = () => {
        window.addEventListener('click', this.listenDocClick);
    }

    public componentWillUnmount = () => {
        window.removeEventListener('click', this.listenDocClick);
    }

    public listenDocClick = (e: any) => {
        const { onClose } = this.props;
        const clickScope = this.contextMenu.contains(e.target);
        if (!clickScope && onClose) {
            onClose(e);
        }
    }

    public onHoverMenuItem = (action: string, item: MenuItemProps) => {
        if (action === 'enter') {
            item.show = true;
        }
        if (action === 'leave') {
            item.show = false;
        }
        this.setState({
            menu: this.state.menu,
        })
    }

    public onClickMenuItem = (item: MenuItemProps, e: React.MouseEvent) => {
        const { onMenuClick } = this.props;
        e.stopPropagation();
        if (onMenuClick) {
            onMenuClick(item.dataSource)
        }
    }

    public renderMenu = (menus: any) => {
        const menuItems: any = [];
        menus.subMenu.forEach((item: any, index: number) => {
            const disabled = item.dataSource.disabled === true;
            if (item.subMenu.length > 0) {
                menuItems.push((
                    <li
                        className={`context-menu-item ${disabled ? 'disabled' : ''}`}
                        key={index}
                        onMouseEnter={this.onHoverMenuItem.bind(this, 'enter', item)}
                        onMouseLeave={this.onHoverMenuItem.bind(this, 'leave', item)}
                        onClick={this.onClickMenuItem.bind(this, item)}
                    >
                        {item.dataSource.label}
                        <div className="context-menu-submenu-icon" />
                        <div className={`context-menu-submenu-container ${item.show ? '' : 'hide'}`}>
                            {this.renderMenu(item)}
                        </div>
                    </li>
                ));
            } else {
                if (item.dataSource.divider === true) {
                    menuItems.push((
                        <li className="divider" key={index} />
                    ));
                } else {
                    menuItems.push((
                        <li
                            className={`context-menu-item ${disabled ? 'disabled' : ''}`}
                            onClick={this.onClickMenuItem.bind(this, item)}
                            key={index}
                        >
                            {item.dataSource.label}
                        </li>
                    ));
                }
            }
        });
        const menuList = (
            <ul className="context-menu-list">
                {menuItems}
            </ul>
        )
        return menuList;
    }

    public render() {

        const {
            position = { x: 0, y: 0 },
            show = false,
        } = this.props;

        const {
            menus,
        } = this.state;

        const containerStyle = {
            display: show ? 'block' : 'none',
            left: position.x + 2,
            top: position.y,
        }
        return (
            <div
                className='context-menu-container'
                style={containerStyle}
                ref={
                    ref => {
                        if (ref) { this.contextMenu = ref }
                    }
                }
            >
                {this.renderMenu(menus)}
            </div>
        );
    }
}

export default Menu;