'use client';

import {
  IconBookmark,
  IconBriefcase,
  IconBuilding,
  IconCamera,
  IconCircles,
  IconCode,
  IconDeviceDesktop,
  IconFolder,
  IconGift,
  IconHeart,
  IconHome,
  IconMusic,
  IconPalette,
  IconPlane,
  IconSchool,
  IconShoppingBag,
  IconStar,
  IconTag,
  IconUser,
  IconUsers
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const icons = [
  { name: 'IconCircles', component: IconCircles },
  { name: 'IconUser', component: IconUser },
  { name: 'IconUsers', component: IconUsers },
  { name: 'IconBriefcase', component: IconBriefcase },
  { name: 'IconBuilding', component: IconBuilding },
  { name: 'IconHeart', component: IconHeart },
  { name: 'IconStar', component: IconStar },
  { name: 'IconTag', component: IconTag },
  { name: 'IconBookmark', component: IconBookmark },
  { name: 'IconFolder', component: IconFolder },
  { name: 'IconHome', component: IconHome },
  { name: 'IconSchool', component: IconSchool },
  { name: 'IconPlane', component: IconPlane },
  { name: 'IconMusic', component: IconMusic },
  { name: 'IconCamera', component: IconCamera },
  { name: 'IconPalette', component: IconPalette },
  { name: 'IconCode', component: IconCode },
  { name: 'IconDeviceDesktop', component: IconDeviceDesktop },
  { name: 'IconShoppingBag', component: IconShoppingBag },
  { name: 'IconGift', component: IconGift }
];

type IconPickerProps = {
  value: string | null;
  onChange: (iconName: string | null) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const selectedIcon = icons.find((icon) => icon.name === value);
  const SelectedIconComponent = selectedIcon?.component || IconCircles;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className="h-10 w-full justify-start">
          <SelectedIconComponent className="w-4 h-4 mr-2" />
          <span>{selectedIcon ? selectedIcon.name : 'Select icon'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid grid-cols-5 gap-2">
          {icons.map((icon) => {
            const IconComponent = icon.component;
            const isSelected = icon.name === value;
            return (
              <Button
                key={icon.name}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  onChange(isSelected ? null : icon.name);
                }}
                className="h-10 w-10 p-0"
                title={icon.name}
              >
                <IconComponent className="w-5 h-5" />
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
