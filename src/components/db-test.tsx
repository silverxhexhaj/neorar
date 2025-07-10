'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createSupabaseClient } from '@/lib/supabase'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function DatabaseTest() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<string>('')
  const [details, setDetails] = useState<any>(null)

  const testConnection = async () => {
    setStatus('testing')
    setResult('')
    setDetails(null)

    try {
      const supabase = createSupabaseClient()
      
      // Test 1: Check if we can connect to Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`)
      }

      // Test 2: Try to query a system table to verify database connectivity
      const { data, error } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1)

      if (error) {
        // If migrations table doesn't exist, try a different approach
        const { data: tables, error: tablesError } = await supabase
          .rpc('get_schema_tables', { schema_name: 'public' })
          .single()

        if (tablesError) {
          // Try basic connection test
          const { data: healthData, error: healthError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .limit(1)

          if (healthError) {
            throw new Error(`Database connection failed: ${healthError.message}`)
          }
        }
      }

      // Test 3: Check auth configuration
      const { data: { user } } = await supabase.auth.getUser()

      setStatus('success')
      setResult('✅ Database connection successful!')
      setDetails({
        url: supabase.supabaseUrl,
        hasSession: !!session,
        currentUser: user?.email || 'Not logged in',
        timestamp: new Date().toISOString()
      })

    } catch (error) {
      setStatus('error')
      setResult(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setDetails({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === 'testing' && <Loader2 className="h-5 w-5 animate-spin" />}
          {status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
          Database Connection Test
        </CardTitle>
        <CardDescription>
          Test your Supabase database connection and authentication setup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={status === 'testing'}
          className="w-full"
        >
          {status === 'testing' ? 'Testing Connection...' : 'Test Database Connection'}
        </Button>

        {result && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-medium">{result}</p>
          </div>
        )}

        {details && (
          <div className="p-4 rounded-lg bg-muted">
            <h4 className="font-medium mb-2">Connection Details:</h4>
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(details, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Environment Variables:</strong></p>
          <p>• URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || '❌ Not set'}</p>
          <p>• Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set'}</p>
        </div>
      </CardContent>
    </Card>
  )
} 