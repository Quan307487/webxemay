import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setting } from './setting.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
    constructor(
        @InjectRepository(Setting)
        private settingsRepository: Repository<Setting>,
    ) { }

    async onModuleInit() {
        // Ensure we have at least one setting entry
        const count = await this.settingsRepository.count();
        if (count === 0) {
            const defaultSetting = this.settingsRepository.create();
            await this.settingsRepository.save(defaultSetting);
        }
    }

    async getSettings(): Promise<Setting> {
        const settings = await this.settingsRepository.find();
        return settings[0];
    }

    async updateSettings(updateData: Partial<Setting>): Promise<Setting> {
        const settings = await this.getSettings();
        Object.assign(settings, updateData);
        return await this.settingsRepository.save(settings);
    }
}
