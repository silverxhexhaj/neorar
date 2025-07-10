'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createSupabaseClient } from '@/lib/supabase'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export function DebugInfo() {
  const supabase = createSupabaseClient()
  
  const envStatus = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    anonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20),
    clientUrl: supabase?.supabaseUrl,
    clientKey: supabase?.supabaseKey?.substring(0, 20),
  }

  const StatusIcon = ({ status }: { status: boolean }) => 
    status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Debug Information
        </CardTitle>
        <CardDescription>
          Environment and client configuration status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Environment Variables</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <StatusIcon status={envStatus.url} />
                <span>NEXT_PUBLIC_SUPABASE_URL:</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {envStatus.urlValue || 'Not set'}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={envStatus.anonKey} />
                <span>NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {envStatus.anonKeyPreview ? `${envStatus.anonKeyPreview}...` : 'Not set'}
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Supabase Client Status</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <StatusIcon status={!!envStatus.clientUrl} />
                <span>Client URL:</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {envStatus.clientUrl || 'Not configured'}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={!!envStatus.clientKey} />
                <span>Client Key:</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {envStatus.clientKey ? `${envStatus.clientKey}...` : 'Not configured'}
                </code>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Browser Environment</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Running in browser:</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {typeof window !== 'undefined' ? 'Yes' : 'No'}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <StatusIcon status={typeof fetch !== 'undefined'} />
                <span>Fetch API available:</span>
                <code className="text-xs bg-muted px-1 rounded">
                  {typeof fetch !== 'undefined' ? 'Yes' : 'No'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {(!envStatus.url || !envStatus.anonKey) && (
          <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300 font-medium">
              ⚠️ Configuration Issue Detected
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Missing environment variables. Please check your .env.local file.
            </p>
          </div>
        )}

        {(envStatus.url && envStatus.anonKey && envStatus.clientUrl && envStatus.clientKey) && (
          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              ✅ Configuration Looks Good
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              All environment variables are set and the Supabase client is properly configured.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 