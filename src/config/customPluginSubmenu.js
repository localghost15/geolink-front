import axiosInstance from "../axios/axiosInstance";
import { toast} from "react-hot-toast";
import {fetchTemplates, saveTemplate} from "../services/templateService";

const customPluginSubmenu = (setTemplates) => ({
    // @Required @Unique
    // plugin name
    name: 'custom_plugin_submenu',

    // @Required
    // data display
    display: 'submenu',

    // @Options
    title: 'Янги шаблон қушиш',
    buttonClass: '',
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
    </svg>`,

    add: function (core, targetElement) {
        const context = core.context;
        context.customSubmenu = {
            targetButton: targetElement,
            titleElement: null,
            currentSpan: null
        };

        let listDiv = this.setSubmenu(core);

        context.customSubmenu.titleElement = listDiv.querySelector('.title-input');

        listDiv.querySelector('.se-btn-primary').addEventListener('click', this.onClick.bind(core, setTemplates));
        listDiv.querySelector('.se-btn').addEventListener('click', this.onClickRemove.bind(core));

        core.initMenuTarget(this.name, targetElement, listDiv);
    },

    setSubmenu: function (core) {
        const listDiv = core.util.createElement('DIV');

        listDiv.className = 'se-menu-container se-submenu se-list-layer';
        listDiv.innerHTML = `
            <div class="se-list-inner">
                <ul class="se-list-basic" style="width: 230px;">
                    <li>
                        <div class="se-form-group">
                            <input class="se-input-form title-input" type="text" placeholder="Insert title" style="border: 1px solid #CCC;" />
                            <button type="button" class="se-btn-primary se-tooltip">
                                <strong>OK</strong>
                                <span class="se-tooltip-inner"><span class="se-tooltip-text">OK</span></span>
                            </button>
                            <button type="button" class="se-btn se-tooltip" style="margin-left: 5px;">
                                <strong>X</strong>
                                <span class="se-tooltip-inner"><span class="se-tooltip-text">Remove all tags</span></span>
                            </button>
                        </div>
                    </li>
                </ul>
            </div>`;
        return listDiv;
    },

    onClick: async function (setTemplates, e) {
        const title = this.context.customSubmenu.titleElement.value;
        const text = this.getContents();
        if (!title || !text) return;
        try {
            await saveTemplate(title, text);
            const updatedTemplates = await fetchTemplates();
            setTemplates(updatedTemplates);
            toast.success('Шаблон муафақиятли яратилди');
        } catch (error) {
            console.error("Error saving template:", error);
        }
    },

    onClickRemove: function (e) {
        this.focus();
        const node = this.util.getParentNode(this.context.customSubmenu.currentSpan, 'SPAN');
        this.util.removeItem(node);
        this.context.customSubmenu.currentSpan = null;
        this.submenuOff();
    }
});

export default customPluginSubmenu;