export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      circles: {
        Row: {
          color: string | null;
          created_at: string;
          description: string | null;
          icon: string | null;
          id: string;
          name: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string;
          description?: string | null;
          icon?: string | null;
          id?: string;
          name?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          reason: string | null;
          url: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          reason?: string | null;
          url?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          reason?: string | null;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      contacts_circles: {
        Row: {
          circle_id: string | null;
          contact_id: string | null;
          created_at: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          circle_id?: string | null;
          contact_id?: string | null;
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          circle_id?: string | null;
          contact_id?: string | null;
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'contacts_groups_contact_id_fkey';
            columns: ['contact_id'];
            isOneToOne: false;
            referencedRelation: 'contacts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'contacts_groups_group_id_fkey';
            columns: ['circle_id'];
            isOneToOne: false;
            referencedRelation: 'circles';
            referencedColumns: ['id'];
          }
        ];
      };
      events: {
        Row: {
          created_at: string;
          description: string | null;
          ends_at: string;
          id: string;
          name: string;
          starts_at: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          ends_at: string;
          id?: string;
          name: string;
          starts_at: string;
          url: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          ends_at?: string;
          id?: string;
          name?: string;
          starts_at?: string;
          url?: string;
        };
        Relationships: [];
      };
      settings: {
        Row: {
          contacts_list_mode: string | null;
          created_at: string;
          id: string;
          is_admin: boolean;
          profile_image_url: string | null;
          qr_link: string | null;
          theme: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          contacts_list_mode?: string | null;
          created_at?: string;
          id?: string;
          is_admin?: boolean;
          profile_image_url?: string | null;
          qr_link?: string | null;
          theme?: string | null;
          updated_at: string;
          user_id?: string | null;
        };
        Update: {
          contacts_list_mode?: string | null;
          created_at?: string;
          id?: string;
          is_admin?: boolean;
          profile_image_url?: string | null;
          qr_link?: string | null;
          theme?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {}
  }
} as const;
