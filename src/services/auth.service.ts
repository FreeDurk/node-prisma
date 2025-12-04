import {
  AuthResponse,
  AuthTokenResponsePassword,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export class AuthService {
  async signUp(params: SignUpWithPasswordCredentials): Promise<AuthResponse> {
    return await supabase.auth.signUp(params);
  }

  async signIn(
    params: SignInWithPasswordCredentials
  ): Promise<AuthTokenResponsePassword> {
    return await supabase.auth.signInWithPassword(params);
  }
}
