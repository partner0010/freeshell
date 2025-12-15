/**
 * 플러그인 시스템
 * Plugin System
 */

export interface Plugin {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  enabled: boolean;
  icon?: string;
  hooks?: {
    onActivate?: () => void;
    onDeactivate?: () => void;
  };
}

export interface PluginManifest {
  name: string;
  description: string;
  version: string;
  author: string;
  entry: string;
  hooks?: string[];
}

// 플러그인 시스템
export class PluginSystem {
  private plugins: Map<string, Plugin> = new Map();
  private activePlugins: Set<string> = new Set();

  // 플러그인 등록
  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
    if (plugin.enabled) {
      this.activatePlugin(plugin.id);
    }
  }

  // 플러그인 활성화
  activatePlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    try {
      plugin.hooks?.onActivate?.();
      plugin.enabled = true;
      this.activePlugins.add(id);
      return true;
    } catch (error) {
      console.error(`Plugin ${id} activation failed:`, error);
      return false;
    }
  }

  // 플러그인 비활성화
  deactivatePlugin(id: string): boolean {
    const plugin = this.plugins.get(id);
    if (!plugin) return false;

    try {
      plugin.hooks?.onDeactivate?.();
      plugin.enabled = false;
      this.activePlugins.delete(id);
      return true;
    } catch (error) {
      console.error(`Plugin ${id} deactivation failed:`, error);
      return false;
    }
  }

  // 플러그인 가져오기
  getPlugin(id: string): Plugin | undefined {
    return this.plugins.get(id);
  }

  // 모든 플러그인 가져오기
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  // 활성화된 플러그인 가져오기
  getActivePlugins(): Plugin[] {
    return Array.from(this.activePlugins).map((id) => this.plugins.get(id)!);
  }

  // 플러그인 설치 (매니페스트 기반)
  async installPlugin(manifest: PluginManifest): Promise<Plugin> {
    const plugin: Plugin = {
      id: `plugin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: manifest.name,
      description: manifest.description,
      version: manifest.version,
      author: manifest.author,
      enabled: false,
    };

    this.registerPlugin(plugin);
    return plugin;
  }
}

export const pluginSystem = new PluginSystem();

