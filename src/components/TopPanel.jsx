import React from 'react';

const TopPanel = () => {
    return (
        <div>
            <div class="flex h-9 items-center border-b border-border px-2 py-1 shadow-sm">
                <nav class="flex space-x-1 text-sm"><a className="px-3 py-1 font-bold" href="#" role="button"
                                                       aria-haspopup="true"> Music </a>
                    <div class="uk-dropdown uk-drop" uk-dropdown="mode: click; pos: bottom-left">
                        <ul class="uk-dropdown-nav uk-nav">
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                About Music
                            </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Preferences
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘,
</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Hide Music
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘H
</span> </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Hide Others
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⇧⌘H
</span> </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Quit Music
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘Q
</span> </a></li>
                        </ul>
                    </div>
                    <a className="px-3 py-1" href="#" role="button" aria-haspopup="true">File</a>
                    <div class="uk-dropdown uk-drop" uk-dropdown="mode: click; pos: bottom-left">
                        <ul class="uk-dropdown-nav uk-nav">
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                New
                            </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Open Stream URL
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘U
</span> </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Close Window
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘W
</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Library
                            </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Import
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘O
</span> </a></li>
                            <li><a className="opacity-50"> Burn Playlist to Disc </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Show in Finder
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⇧⌘R
</span> </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Convert
                            </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Page Setup
                            </a></li>
                            <li><a className="opacity-50">Print</a></li>
                        </ul>
                    </div>
                    <a className="px-3 py-1" href="#" role="button" aria-haspopup="true">Edit</a>
                    <div class="uk-dropdown uk-drop" uk-dropdown="mode: click; pos: bottom-left"
                         style="max-width: 1552px; top: 41.6667px; left: 124.729px;">
                        <ul class="uk-dropdown-nav uk-nav">
                            <li><a className="opacity-50">
                                Undo
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘Z
</span> </a></li>
                            <li><a className="opacity-50">
                                Redo
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⇧⌘Z
</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="opacity-50">
                                Cut
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘X
</span> </a></li>
                            <li><a className="opacity-50">
                                Copy
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘C
</span> </a></li>
                            <li><a className="opacity-50">
                                Paste
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘V
</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Select All
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⌘A
</span> </a></li>
                            <li><a className="opacity-50">
                                Deselect All
                                <span class="ml-auto text-xs tracking-widest opacity-60">
⇧⌘A
</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Smart Dictation
                                <span class="ml-auto text-muted-foreground"> <svg xmlns="http://www.w3.org/2000/svg"
                                                                                  fill="none" stroke="currentColor"
                                                                                  stroke-linecap="round"
                                                                                  stroke-linejoin="round"
                                                                                  stroke-width="2" className="h-4 w-4"
                                                                                  viewBox="0 0 24 24"><path
                                    d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path><circle cx="17" cy="7"
                                                                                                       r="5"></circle></svg> </span>
                            </a></li>
                            <li><a className="uk-drop-close justify-between" href="#demo" uk-toggle="" role="button">
                                Emojis &amp; Symbols
                                <span class="ml-auto text-muted-foreground"> <svg xmlns="http://www.w3.org/2000/svg"
                                                                                  fill="none" stroke="currentColor"
                                                                                  stroke-linecap="round"
                                                                                  stroke-linejoin="round"
                                                                                  stroke-width="2" className="h-4 w-4"
                                                                                  viewBox="0 0 24 24"><circle cx="12"
                                                                                                              cy="12"
                                                                                                              r="10"></circle><path
                                    d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg> </span>
                            </a></li>
                        </ul>
                    </div>
                    <a className="px-3 py-1" href="#" role="button" aria-haspopup="true">View</a>
                    <div class="uk-dropdown uk-drop" uk-drop="mode: click; pos: bottom-left"
                         style="max-width: 1552px; top: 41.6667px; left: 177.51px;">
                        <ul class="uk-dropdown-nav">
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button"> <span
                                class="ml-6">Show Playing Next</span> </a></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                     stroke-linejoin="round" className="lucide lucide-check mr-2">
                                    <path d="M20 6 9 17l-5-5"></path>
                                </svg>
                                Show Lyrics
                            </a></li>
                            <li><a className="opacity-50"> <span class="ml-6">Show Status Bar</span> </a></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button"> <span
                                class="ml-6">Hide Sidebar</span> </a></li>
                            <li><a className="opacity-50"> <span class="ml-6">Enter Full Screen</span> </a></li>
                        </ul>
                    </div>
                    <a className="px-3 py-1" href="#" role="button" aria-haspopup="true">Account</a>
                    <div class="uk-dropdown uk-drop" uk-drop="mode: click; pos: bottom-left"
                         style="max-width: 1552px; top: 41.6667px; left: 237.354px;">
                        <ul class="uk-dropdown-nav">
                            <li className="uk-nav-header"><span class="ml-6"> Switch Account </span></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button"> <span
                                class="ml-6">Andy</span> </a></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button">
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
                                     xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4 fill-current">
                                    <path
                                        d="M9.875 7.5C9.875 8.81168 8.81168 9.875 7.5 9.875C6.18832 9.875 5.125 8.81168 5.125 7.5C5.125 6.18832 6.18832 5.125 7.5 5.125C8.81168 5.125 9.875 6.18832 9.875 7.5Z"
                                        fill="currentColor"></path>
                                </svg>
                                Benoit
                            </a></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button"> <span
                                class="ml-6">Luis</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button"> <span
                                class="ml-6">Manage Family</span> </a></li>
                            <li className="uk-nav-divider"></li>
                            <li><a className="uk-drop-close" href="#demo" uk-toggle="" role="button"> <span
                                class="ml-6">Add Account</span> </a></li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default TopPanel;
